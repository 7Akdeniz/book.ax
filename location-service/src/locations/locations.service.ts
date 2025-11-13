import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { SlugGenerator, LanguageUtil, GeoUtil, PaginationUtil } from '../common/utils';
import {
  SearchLocationDto,
  AutocompleteDto,
  CountryFilterDto,
  CityFilterDto,
  PoiFilterDto,
} from './dto/request.dto';
import {
  CountryResponseDto,
  CityResponseDto,
  DistrictResponseDto,
  PoiResponseDto,
  AutocompleteItemDto,
  SearchResultDto,
} from './dto/response.dto';
import {
  CreateCityDto,
  UpdateCityDto,
  CreateDistrictDto,
  UpdateDistrictDto,
  CreatePoiDto,
  UpdatePoiDto,
  CreateCountryDto,
  UpdateCountryDto,
  CreateRegionDto,
  UpdateRegionDto,
  CreateAliasDto,
} from './dto/admin.dto';

@Injectable()
export class LocationsService {
  private readonly logger = new Logger(LocationsService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  // ==================== SEARCH & AUTOCOMPLETE ====================

  async search(dto: SearchLocationDto): Promise<SearchResultDto> {
    const searchTerm = dto.q.toLowerCase();
    const language = dto.language || 'en';

    const results: SearchResultDto = {
      countries: [],
      cities: [],
      districts: [],
      pois: [],
      total_results: 0,
    };

    // Search countries
    if (!dto.type || dto.type === 'country') {
      const countries = await this.searchCountries(searchTerm, language, dto.limit);
      results.countries = countries;
    }

    // Search cities
    if (!dto.type || dto.type === 'city') {
      const cities = await this.searchCities(searchTerm, language, dto);
      results.cities = cities;
    }

    // Search districts
    if (!dto.type || dto.type === 'district') {
      const districts = await this.searchDistricts(searchTerm, language, dto);
      results.districts = districts;
    }

    // Search POIs
    if (!dto.type || dto.type === 'poi') {
      const pois = await this.searchPois(searchTerm, language, dto);
      results.pois = pois;
    }

    results.total_results =
      results.countries.length +
      results.cities.length +
      results.districts.length +
      results.pois.length;

    return results;
  }

  async autocomplete(dto: AutocompleteDto): Promise<AutocompleteItemDto[]> {
    const searchTerm = dto.q.toLowerCase();
    const language = dto.language || 'en';
    const limit = Math.min(dto.limit || 10, 20);

    const results: AutocompleteItemDto[] = [];

    // Search in parallel for better performance
    const [countries, cities, districts, pois] = await Promise.all([
      this.autocompleteCountries(searchTerm, language, Math.ceil(limit / 4)),
      this.autocompleteCities(searchTerm, language, Math.ceil(limit / 2)),
      this.autocompleteDistricts(searchTerm, language, Math.ceil(limit / 6)),
      this.autocompletePois(searchTerm, language, Math.ceil(limit / 6)),
    ]);

    results.push(...countries, ...cities, ...districts, ...pois);

    // Sort by relevance (major cities first, then by name)
    return results.slice(0, limit);
  }

  private async searchCountries(
    searchTerm: string,
    language: string,
    limit?: number
  ): Promise<CountryResponseDto[]> {
    const countries = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT c.*, cn.name_en as continent_name_en, cn.name_de as continent_name_de,
             cn.name_es as continent_name_es, cn.name_fr as continent_name_fr, cn.name_tr as continent_name_tr
      FROM countries c
      LEFT JOIN continents cn ON c.continent_id = cn.id
      WHERE 
        LOWER(c.name_en) LIKE $1 OR
        LOWER(c.name_de) LIKE $1 OR
        LOWER(c.name_es) LIKE $1 OR
        LOWER(c.name_fr) LIKE $1 OR
        LOWER(c.name_tr) LIKE $1 OR
        LOWER(c.iso2) = $2 OR
        LOWER(c.iso3) = $2
      ORDER BY 
        CASE 
          WHEN LOWER(c.name_en) = $2 THEN 1
          WHEN LOWER(c.iso2) = $2 THEN 2
          ELSE 3
        END,
        c.population DESC NULLS LAST
      LIMIT $3
    `, `%${searchTerm}%`, searchTerm, limit || 10);

    return countries.map(c => this.mapCountryResponse(c, language));
  }

  private async searchCities(
    searchTerm: string,
    language: string,
    dto: SearchLocationDto
  ): Promise<CityResponseDto[]> {
    const whereClause = dto.country 
      ? `AND co.iso2 = '${dto.country.toUpperCase()}'`
      : '';

    let orderBy = `c.is_major_city DESC, c.population DESC NULLS LAST`;

    // If proximity search is enabled
    if (dto.near_lat && dto.near_lng) {
      const cities = await this.searchCitiesNearby(searchTerm, language, dto);
      return cities;
    }

    const cities = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT c.*, 
             co.name_en as country_name_en, co.name_de as country_name_de, co.iso2,
             r.name as region_name,
             ST_X(c.location::geometry) as longitude,
             ST_Y(c.location::geometry) as latitude
      FROM cities c
      LEFT JOIN countries co ON c.country_id = co.id
      LEFT JOIN regions r ON c.region_id = r.id
      WHERE (
        LOWER(c.name) LIKE $1 OR
        LOWER(c.name_en) LIKE $1 OR
        LOWER(c.name_de) LIKE $1 OR
        LOWER(c.slug) LIKE $1
      ) ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $2
    `, `%${searchTerm}%`, dto.limit || 20);

    return cities.map(c => this.mapCityResponse(c, language));
  }

  private async searchCitiesNearby(
    searchTerm: string,
    language: string,
    dto: SearchLocationDto
  ): Promise<CityResponseDto[]> {
    const cities = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT c.*, 
             co.name_en as country_name_en, co.name_de as country_name_de, co.iso2,
             r.name as region_name,
             ST_X(c.location::geometry) as longitude,
             ST_Y(c.location::geometry) as latitude,
             ST_Distance(c.location::geography, ST_MakePoint($3, $4)::geography) / 1000 as distance_km
      FROM cities c
      LEFT JOIN countries co ON c.country_id = co.id
      LEFT JOIN regions r ON c.region_id = r.id
      WHERE (
        LOWER(c.name) LIKE $1 OR
        LOWER(c.name_en) LIKE $1 OR
        LOWER(c.name_de) LIKE $1
      )
      AND ST_DWithin(c.location::geography, ST_MakePoint($3, $4)::geography, $5 * 1000)
      ORDER BY distance_km
      LIMIT $2
    `, `%${searchTerm}%`, dto.limit || 20, dto.near_lng, dto.near_lat, dto.radius_km || 50);

    return cities.map(c => this.mapCityResponse(c, language));
  }

  private async searchDistricts(
    searchTerm: string,
    language: string,
    dto: SearchLocationDto
  ): Promise<DistrictResponseDto[]> {
    const districts = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT d.*,
             c.name as city_name, c.slug as city_slug,
             co.name_en as country_name_en, co.iso2,
             ST_X(d.location::geometry) as longitude,
             ST_Y(d.location::geometry) as latitude
      FROM districts d
      LEFT JOIN cities c ON d.city_id = c.id
      LEFT JOIN countries co ON c.country_id = co.id
      WHERE 
        LOWER(d.name) LIKE $1 OR
        LOWER(d.name_en) LIKE $1 OR
        LOWER(d.slug) LIKE $1
      ORDER BY c.is_major_city DESC, c.population DESC NULLS LAST
      LIMIT $2
    `, `%${searchTerm}%`, dto.limit || 20);

    return districts.map(d => this.mapDistrictResponse(d, language));
  }

  private async searchPois(
    searchTerm: string,
    language: string,
    dto: SearchLocationDto
  ): Promise<PoiResponseDto[]> {
    let distanceClause = '';
    let orderBy = 'c.is_major_city DESC, c.population DESC NULLS LAST';

    if (dto.near_lat && dto.near_lng) {
      distanceClause = `AND ST_DWithin(p.location::geography, ST_MakePoint($3, $4)::geography, $5 * 1000)`;
      orderBy = `ST_Distance(p.location::geography, ST_MakePoint($3, $4)::geography) / 1000`;
    }

    const pois = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT p.*,
             c.name as city_name, c.slug as city_slug,
             co.name_en as country_name_en,
             ST_X(p.location::geometry) as longitude,
             ST_Y(p.location::geometry) as latitude
             ${dto.near_lat && dto.near_lng ? ', ST_Distance(p.location::geography, ST_MakePoint($3, $4)::geography) / 1000 as distance_km' : ''}
      FROM points_of_interest p
      LEFT JOIN cities c ON p.city_id = c.id
      LEFT JOIN countries co ON c.country_id = co.id
      WHERE 
        LOWER(p.name) LIKE $1 OR
        LOWER(p.slug) LIKE $1 OR
        LOWER(p.iata_code) = $2 OR
        LOWER(p.icao_code) = $2
        ${distanceClause}
      ORDER BY ${orderBy}
      LIMIT ${dto.limit || 20}
    `, `%${searchTerm}%`, searchTerm, dto.near_lng, dto.near_lat, dto.radius_km || 50);

    return pois.map(p => this.mapPoiResponse(p, language));
  }

  private async autocompleteCountries(
    searchTerm: string,
    language: string,
    limit: number
  ): Promise<AutocompleteItemDto[]> {
    const countries = await this.searchCountries(searchTerm, language, limit);
    
    return countries.map(c => ({
      type: 'country',
      id: c.id,
      display_name: c.display_name || c.name_en,
      country_name: c.display_name || c.name_en,
      slug: c.iso2.toLowerCase(),
    }));
  }

  private async autocompleteCities(
    searchTerm: string,
    language: string,
    limit: number
  ): Promise<AutocompleteItemDto[]> {
    const cities = await this.searchCities(searchTerm, language, { q: searchTerm, language, limit } as any);
    
    return cities.map(c => ({
      type: 'city',
      id: c.id,
      display_name: `${c.display_name || c.name}, ${c.country?.display_name || c.country?.name_en || ''}`,
      country_name: c.country?.display_name || c.country?.name_en,
      region_name: c.region?.display_name,
      city_name: c.display_name || c.name,
      slug: c.slug,
    }));
  }

  private async autocompleteDistricts(
    searchTerm: string,
    language: string,
    limit: number
  ): Promise<AutocompleteItemDto[]> {
    const districts = await this.searchDistricts(searchTerm, language, { q: searchTerm, language, limit } as any);
    
    return districts.map(d => ({
      type: 'district',
      id: d.id,
      display_name: `${d.display_name || d.name}, ${d.city?.name || ''}`,
      country_name: d.city?.country?.display_name,
      city_name: d.city?.name,
      slug: d.slug,
    }));
  }

  private async autocompletePois(
    searchTerm: string,
    language: string,
    limit: number
  ): Promise<AutocompleteItemDto[]> {
    const pois = await this.searchPois(searchTerm, language, { q: searchTerm, language, limit } as any);
    
    return pois.map(p => ({
      type: 'poi',
      id: p.id,
      display_name: `${p.name} (${p.type})`,
      country_name: p.city?.country?.display_name,
      city_name: p.city?.name,
      slug: p.slug,
    }));
  }

  // ==================== COUNTRIES ====================

  async getCountries(dto: CountryFilterDto) {
    const offset = PaginationUtil.calculateOffset(dto.page || 1, dto.limit || 20);
    const where: any = {};

    if (dto.continent) {
      where.continent = { code: dto.continent.toUpperCase() };
    }

    if (dto.q) {
      where.OR = [
        { nameEn: { contains: dto.q, mode: 'insensitive' } },
        { nameDe: { contains: dto.q, mode: 'insensitive' } },
        { nameEs: { contains: dto.q, mode: 'insensitive' } },
        { nameFr: { contains: dto.q, mode: 'insensitive' } },
        { iso2: { equals: dto.q.toUpperCase() } },
        { iso3: { equals: dto.q.toUpperCase() } },
      ];
    }

    const [countries, total] = await Promise.all([
      this.prisma.country.findMany({
        where,
        include: { continent: true },
        skip: offset,
        take: dto.limit || 20,
        orderBy: [{ nameEn: 'asc' }],
      }),
      this.prisma.country.count({ where }),
    ]);

    const mapped = countries.map(c => this.mapCountryResponse(c, dto.language || 'en'));

    return PaginationUtil.createPaginatedResponse(mapped, total, dto.page || 1, dto.limit || 20);
  }

  async getCountryById(id: string, language: string = 'en') {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: {
        continent: true,
        regions: true,
        cities: {
          where: { isMajorCity: true },
          take: 20,
          orderBy: { population: 'desc' },
        },
      },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return this.mapCountryResponse(country, language);
  }

  // ==================== CITIES ====================

  async getCities(dto: CityFilterDto) {
    const offset = PaginationUtil.calculateOffset(dto.page || 1, dto.limit || 20);
    const where: any = {};

    if (dto.country) {
      where.country = { iso2: dto.country.toUpperCase() };
    }

    if (dto.region) {
      where.regionId = dto.region;
    }

    if (dto.is_major_city !== undefined) {
      where.isMajorCity = dto.is_major_city;
    }

    if (dto.q) {
      where.OR = [
        { name: { contains: dto.q, mode: 'insensitive' } },
        { nameEn: { contains: dto.q, mode: 'insensitive' } },
        { slug: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    const [cities, total] = await Promise.all([
      this.prisma.city.findMany({
        where,
        include: { country: true, region: true },
        skip: offset,
        take: dto.limit || 20,
        orderBy: [{ isMajorCity: 'desc' }, { population: 'desc' }],
      }),
      this.prisma.city.count({ where }),
    ]);

    const mapped = cities.map(c => this.mapCityResponse(c, dto.language || 'en'));

    return PaginationUtil.createPaginatedResponse(mapped, total, dto.page || 1, dto.limit || 20);
  }

  async getCityById(id: string, language: string = 'en') {
    const city = await this.prisma.city.findUnique({
      where: { id },
      include: {
        country: true,
        region: true,
        districts: { take: 50 },
        pois: { take: 20, orderBy: { type: 'asc' } },
      },
    });

    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }

    return this.mapCityResponse(city, language);
  }

  // ==================== POIs ====================

  async getPois(dto: PoiFilterDto) {
    const offset = PaginationUtil.calculateOffset(dto.page || 1, dto.limit || 20);
    const where: any = {};

    if (dto.city) {
      where.cityId = dto.city;
    }

    if (dto.type) {
      where.type = dto.type.toUpperCase();
    }

    if (dto.q) {
      where.OR = [
        { name: { contains: dto.q, mode: 'insensitive' } },
        { slug: { contains: dto.q, mode: 'insensitive' } },
        { iataCode: { equals: dto.q.toUpperCase() } },
      ];
    }

    const [pois, total] = await Promise.all([
      this.prisma.pointOfInterest.findMany({
        where,
        include: { city: { include: { country: true } }, district: true },
        skip: offset,
        take: dto.limit || 20,
      }),
      this.prisma.pointOfInterest.count({ where }),
    ]);

    const mapped = pois.map(p => this.mapPoiResponse(p, dto.language || 'en'));

    return PaginationUtil.createPaginatedResponse(mapped, total, dto.page || 1, dto.limit || 20);
  }

  // ==================== ADMIN: CREATE ====================

  async createCountry(dto: CreateCountryDto) {
    const slug = SlugGenerator.generate(dto.name_en);
    
    return this.prisma.country.create({
      data: {
        continentId: dto.continent_id,
        iso2: dto.iso2.toUpperCase(),
        iso3: dto.iso3.toUpperCase(),
        numericCode: dto.numeric_code,
        nameOfficial: dto.name_official,
        nameEn: dto.name_en,
        nameDe: dto.name_de,
        nameFr: dto.name_fr,
        nameEs: dto.name_es,
        nameTr: dto.name_tr,
        capital: dto.capital,
        currencyCode: dto.currency_code,
        phoneCode: dto.phone_code,
        population: dto.population ? BigInt(dto.population) : null,
        timezones: dto.timezones || [],
      },
    });
  }

  async createRegion(dto: CreateRegionDto) {
    return this.prisma.region.create({
      data: {
        countryId: dto.country_id,
        code: dto.code,
        name: dto.name,
        nameEn: dto.name_en,
        nameDe: dto.name_de,
        nameFr: dto.name_fr,
        nameEs: dto.name_es,
        nameTr: dto.name_tr,
      },
    });
  }

  async createCity(dto: CreateCityDto) {
    const slug = dto.slug || SlugGenerator.generate(dto.name);

    const location = dto.latitude && dto.longitude
      ? Prisma.sql`ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`
      : null;

    return this.prisma.$executeRaw`
      INSERT INTO cities (
        id, country_id, region_id, name, slug, name_en, name_de, name_fr, name_es, name_tr,
        population, location, timezone, is_capital, is_major_city, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${dto.country_id}, ${dto.region_id}, ${dto.name}, ${slug},
        ${dto.name_en}, ${dto.name_de}, ${dto.name_fr}, ${dto.name_es}, ${dto.name_tr},
        ${dto.population}, ${location}, ${dto.timezone}, ${dto.is_capital || false}, ${dto.is_major_city || false},
        NOW(), NOW()
      )
    `;
  }

  async createDistrict(dto: CreateDistrictDto) {
    const slug = dto.slug || SlugGenerator.generate(dto.name);

    const location = dto.latitude && dto.longitude
      ? Prisma.sql`ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326)`
      : null;

    return this.prisma.$executeRaw`
      INSERT INTO districts (
        id, city_id, name, slug, name_en, name_de, name_fr, name_es, name_tr, location, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${dto.city_id}, ${dto.name}, ${slug},
        ${dto.name_en}, ${dto.name_de}, ${dto.name_fr}, ${dto.name_es}, ${dto.name_tr}, ${location},
        NOW(), NOW()
      )
    `;
  }

  async createPoi(dto: CreatePoiDto) {
    const slug = dto.slug || SlugGenerator.generate(dto.name);

    return this.prisma.$executeRaw`
      INSERT INTO points_of_interest (
        id, city_id, district_id, type, name, slug, description_short, 
        location, iata_code, icao_code, external_id, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), ${dto.city_id}, ${dto.district_id}, ${dto.type}::poi_type, ${dto.name}, ${slug},
        ${dto.description_short}, ST_SetSRID(ST_MakePoint(${dto.longitude}, ${dto.latitude}), 4326),
        ${dto.iata_code}, ${dto.icao_code}, ${dto.external_id}, NOW(), NOW()
      )
    `;
  }

  async createAlias(dto: CreateAliasDto) {
    return this.prisma.locationAlias.create({
      data: {
        targetType: dto.target_type as any,
        targetId: dto.target_id,
        aliasName: dto.alias_name,
        languageCode: dto.language_code,
        useForSearch: dto.use_for_search ?? true,
      },
    });
  }

  // ==================== ADMIN: UPDATE ====================

  async updateCountry(id: string, dto: UpdateCountryDto) {
    return this.prisma.country.update({
      where: { id },
      data: {
        nameOfficial: dto.name_official,
        nameEn: dto.name_en,
        nameDe: dto.name_de,
        nameFr: dto.name_fr,
        nameEs: dto.name_es,
        nameTr: dto.name_tr,
        capital: dto.capital,
        currencyCode: dto.currency_code,
        phoneCode: dto.phone_code,
        population: dto.population ? BigInt(dto.population) : undefined,
        timezones: dto.timezones,
      },
    });
  }

  async updateCity(id: string, dto: UpdateCityDto) {
    const updateData: any = {
      name: dto.name,
      slug: dto.slug,
      nameEn: dto.name_en,
      nameDe: dto.name_de,
      nameFr: dto.name_fr,
      nameEs: dto.name_es,
      nameTr: dto.name_tr,
      population: dto.population,
      timezone: dto.timezone,
      isCapital: dto.is_capital,
      isMajorCity: dto.is_major_city,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    return this.prisma.city.update({
      where: { id },
      data: updateData,
    });
  }

  // ==================== ADMIN: DELETE ====================

  async deleteCountry(id: string) {
    return this.prisma.country.delete({ where: { id } });
  }

  async deleteRegion(id: string) {
    return this.prisma.region.delete({ where: { id } });
  }

  async deleteCity(id: string) {
    return this.prisma.city.delete({ where: { id } });
  }

  async deleteDistrict(id: string) {
    return this.prisma.district.delete({ where: { id } });
  }

  async deletePoi(id: string) {
    return this.prisma.pointOfInterest.delete({ where: { id } });
  }

  async deleteAlias(id: string) {
    return this.prisma.locationAlias.delete({ where: { id } });
  }

  // ==================== MAPPERS ====================

  private mapCountryResponse(country: any, language: string): CountryResponseDto {
    return {
      id: country.id,
      iso2: country.iso2,
      iso3: country.iso3,
      name_official: country.name_official || country.nameOfficial,
      name_en: country.name_en || country.nameEn,
      name_de: country.name_de || country.nameDe,
      name_fr: country.name_fr || country.nameFr,
      name_es: country.name_es || country.nameEs,
      name_tr: country.name_tr || country.nameTr,
      capital: country.capital,
      currency_code: country.currency_code || country.currencyCode,
      phone_code: country.phone_code || country.phoneCode,
      population: country.population ? Number(country.population) : undefined,
      timezones: country.timezones,
      display_name: LanguageUtil.getLocalizedName(
        {
          name_en: country.name_en || country.nameEn,
          name_de: country.name_de || country.nameDe,
          name_es: country.name_es || country.nameEs,
          name_fr: country.name_fr || country.nameFr,
          name_tr: country.name_tr || country.nameTr,
        },
        language as any
      ),
    };
  }

  private mapCityResponse(city: any, language: string): CityResponseDto {
    return {
      id: city.id,
      name: city.name,
      slug: city.slug,
      name_en: city.name_en || city.nameEn,
      name_de: city.name_de || city.nameDe,
      name_fr: city.name_fr || city.nameFr,
      name_es: city.name_es || city.nameEs,
      name_tr: city.name_tr || city.nameTr,
      population: city.population,
      timezone: city.timezone,
      is_capital: city.is_capital ?? city.isCapital ?? false,
      is_major_city: city.is_major_city ?? city.isMajorCity ?? false,
      latitude: city.latitude,
      longitude: city.longitude,
      distance_km: city.distance_km,
      country: city.country ? this.mapCountryResponse(city.country, language) : undefined,
      display_name: LanguageUtil.getLocalizedName(
        {
          name: city.name,
          name_en: city.name_en || city.nameEn,
          name_de: city.name_de || city.nameDe,
          name_es: city.name_es || city.nameEs,
          name_fr: city.name_fr || city.nameFr,
          name_tr: city.name_tr || city.nameTr,
        },
        language as any
      ),
    };
  }

  private mapDistrictResponse(district: any, language: string): DistrictResponseDto {
    return {
      id: district.id,
      name: district.name,
      slug: district.slug,
      name_en: district.name_en || district.nameEn,
      name_de: district.name_de || district.nameDe,
      name_fr: district.name_fr || district.nameFr,
      name_es: district.name_es || district.nameEs,
      name_tr: district.name_tr || district.nameTr,
      latitude: district.latitude,
      longitude: district.longitude,
      display_name: LanguageUtil.getLocalizedName(
        {
          name: district.name,
          name_en: district.name_en || district.nameEn,
          name_de: district.name_de || district.nameDe,
        },
        language as any
      ),
    };
  }

  private mapPoiResponse(poi: any, language: string): PoiResponseDto {
    return {
      id: poi.id,
      type: poi.type,
      name: poi.name,
      slug: poi.slug,
      description_short: poi.description_short || poi.descriptionShort,
      iata_code: poi.iata_code || poi.iataCode,
      icao_code: poi.icao_code || poi.icaoCode,
      latitude: poi.latitude,
      longitude: poi.longitude,
      distance_km: poi.distance_km,
    };
  }
}
