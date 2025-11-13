import { PrismaClient } from '@prisma/client';
import { continentsData } from './data/continents.data';
import { countriesData } from './data/countries.data';
import { regionsData } from './data/regions.data';
import { allCities } from './data/cities.data';
import { allPOIs } from './data/pois.data';

const prisma = new PrismaClient();

async function seedContinents() {
  console.log('🌍 Seeding continents...');
  
  for (const continent of continentsData) {
    await prisma.continent.upsert({
      where: { code: continent.code },
      update: continent,
      create: continent,
    });
  }
  
  console.log(`✅ Seeded ${continentsData.length} continents`);
}

async function seedCountries() {
  console.log('🌎 Seeding countries...');
  
  const continents = await prisma.continent.findMany();
  const continentMap = new Map(continents.map(c => [c.code, c.id]));
  
  for (const country of countriesData) {
    const continentId = continentMap.get(country.continent_code);
    if (!continentId) {
      console.warn(`⚠️ Continent ${country.continent_code} not found for country ${country.iso2}`);
      continue;
    }
    
    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        continentId,
        iso3: country.iso3,
        numericCode: country.numeric_code,
        nameOfficial: country.name_official,
        nameEn: country.name_en,
        nameDe: country.name_de,
        nameFr: country.name_fr,
        nameEs: country.name_es,
        nameTr: country.name_tr,
        capital: country.capital,
        currencyCode: country.currency_code,
        phoneCode: country.phone_code,
        population: country.population ? BigInt(country.population) : null,
        timezones: country.timezones,
      },
      create: {
        continentId,
        iso2: country.iso2,
        iso3: country.iso3,
        numericCode: country.numeric_code,
        nameOfficial: country.name_official,
        nameEn: country.name_en,
        nameDe: country.name_de,
        nameFr: country.name_fr,
        nameEs: country.name_es,
        nameTr: country.name_tr,
        capital: country.capital,
        currencyCode: country.currency_code,
        phoneCode: country.phone_code,
        population: country.population ? BigInt(country.population) : null,
        timezones: country.timezones,
      },
    });
  }
  
  console.log(`✅ Seeded ${countriesData.length} countries`);
}

async function seedRegions() {
  console.log('🏞️ Seeding regions...');
  
  const countries = await prisma.country.findMany();
  const countryMap = new Map(countries.map(c => [c.iso2, c.id]));
  
  for (const region of regionsData) {
    const countryId = countryMap.get(region.country_iso2);
    if (!countryId) {
      console.warn(`⚠️ Country ${region.country_iso2} not found for region ${region.code}`);
      continue;
    }
    
    await prisma.region.upsert({
      where: { countryId_code: { countryId, code: region.code } },
      update: {
        name: region.name,
        nameEn: region.name_en,
        nameDe: region.name_de,
        nameFr: region.name_fr,
        nameEs: region.name_es,
        nameTr: region.name_tr,
      },
      create: {
        countryId,
        code: region.code,
        name: region.name,
        nameEn: region.name_en,
        nameDe: region.name_de,
        nameFr: region.name_fr,
        nameEs: region.name_es,
        nameTr: region.name_tr,
      },
    });
  }
  
  console.log(`✅ Seeded ${regionsData.length} regions`);
}

async function seedCities() {
  console.log('🏙️ Seeding cities...');
  
  const countries = await prisma.country.findMany();
  const countryMap = new Map(countries.map(c => [c.iso2, c.id]));
  
  const regions = await prisma.region.findMany();
  const regionMap = new Map(regions.map(r => [`${r.countryId}-${r.code}`, r.id]));
  
  for (const city of allCities) {
    const countryId = countryMap.get(city.country_iso2);
    if (!countryId) {
      console.warn(`⚠️ Country ${city.country_iso2} not found for city ${city.name}`);
      continue;
    }
    
    let regionId = null;
    if (city.region_code) {
      regionId = regionMap.get(`${countryId}-${city.region_code}`) || null;
    }
    
    const slug = city.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Use raw SQL to insert with PostGIS geometry
    await prisma.$executeRaw`
      INSERT INTO cities (
        id, country_id, region_id, name, slug, name_en, name_de, name_fr, name_es, name_tr,
        population, location, timezone, is_capital, is_major_city, created_at, updated_at
      ) VALUES (
        gen_random_uuid(),
        ${countryId}::uuid,
        ${regionId}::uuid,
        ${city.name},
        ${slug},
        ${city.name_en || city.name},
        ${city.name_de || null},
        ${city.name_fr || null},
        ${city.name_es || null},
        ${city.name_tr || null},
        ${city.population || null},
        ST_SetSRID(ST_MakePoint(${city.longitude}, ${city.latitude}), 4326),
        ${city.timezone},
        ${city.is_capital},
        ${city.is_major_city},
        NOW(),
        NOW()
      )
      ON CONFLICT (country_id, slug) DO UPDATE SET
        name = EXCLUDED.name,
        population = EXCLUDED.population,
        location = EXCLUDED.location,
        is_capital = EXCLUDED.is_capital,
        is_major_city = EXCLUDED.is_major_city,
        updated_at = NOW()
    `;
  }
  
  console.log(`✅ Seeded ${allCities.length} cities`);
}

async function seedPOIs() {
  console.log('📍 Seeding POIs...');
  
  const cities = await prisma.city.findMany({
    include: { country: true },
  });
  
  const cityMap = new Map(cities.map(c => [c.name.toLowerCase(), c.id]));
  
  for (const poi of allPOIs) {
    const cityId = cityMap.get(poi.city_name.toLowerCase());
    if (!cityId) {
      console.warn(`⚠️ City ${poi.city_name} not found for POI ${poi.name}`);
      continue;
    }
    
    const slug = poi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    await prisma.$executeRaw`
      INSERT INTO points_of_interest (
        id, city_id, type, name, slug, description_short,
        location, iata_code, icao_code, created_at, updated_at
      ) VALUES (
        gen_random_uuid(),
        ${cityId}::uuid,
        ${poi.type}::poi_type,
        ${poi.name},
        ${slug},
        ${poi.description_short || null},
        ST_SetSRID(ST_MakePoint(${poi.longitude}, ${poi.latitude}), 4326),
        ${poi.iata_code || null},
        ${poi.icao_code || null},
        NOW(),
        NOW()
      )
      ON CONFLICT (city_id, slug) DO UPDATE SET
        name = EXCLUDED.name,
        description_short = EXCLUDED.description_short,
        location = EXCLUDED.location,
        updated_at = NOW()
    `;
  }
  
  console.log(`✅ Seeded ${allPOIs.length} POIs`);
}

async function main() {
  console.log('🌟 Starting database seeding...\n');
  
  try {
    await seedContinents();
    await seedCountries();
    await seedRegions();
    await seedCities();
    await seedPOIs();
    
    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
