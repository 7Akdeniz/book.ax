import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ContinentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name_en: string;

  @ApiProperty()
  name_de: string;

  @ApiProperty()
  name_fr: string;

  @ApiProperty()
  name_es: string;

  @ApiProperty()
  name_tr: string;

  @ApiPropertyOptional()
  display_name?: string;
}

export class CountryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  iso3: string;

  @ApiProperty()
  name_official: string;

  @ApiProperty()
  name_en: string;

  @ApiProperty()
  name_de: string;

  @ApiProperty()
  name_fr: string;

  @ApiProperty()
  name_es: string;

  @ApiProperty()
  name_tr: string;

  @ApiPropertyOptional()
  capital?: string;

  @ApiPropertyOptional()
  currency_code?: string;

  @ApiPropertyOptional()
  phone_code?: string;

  @ApiPropertyOptional()
  population?: number;

  @ApiPropertyOptional({ type: [String] })
  timezones?: string[];

  @ApiPropertyOptional()
  continent?: ContinentResponseDto;

  @ApiPropertyOptional()
  display_name?: string;
}

export class RegionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  name_en?: string;

  @ApiPropertyOptional()
  name_de?: string;

  @ApiPropertyOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  name_es?: string;

  @ApiPropertyOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  country?: CountryResponseDto;

  @ApiPropertyOptional()
  display_name?: string;
}

export class CityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  name_en?: string;

  @ApiPropertyOptional()
  name_de?: string;

  @ApiPropertyOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  name_es?: string;

  @ApiPropertyOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  population?: number;

  @ApiPropertyOptional()
  timezone?: string;

  @ApiProperty()
  is_capital: boolean;

  @ApiProperty()
  is_major_city: boolean;

  @ApiPropertyOptional({ description: 'Latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  longitude?: number;

  @ApiPropertyOptional()
  country?: CountryResponseDto;

  @ApiPropertyOptional()
  region?: RegionResponseDto;

  @ApiPropertyOptional()
  display_name?: string;

  @ApiPropertyOptional({ description: 'Distance in km (only for proximity searches)' })
  distance_km?: number;
}

export class DistrictResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  name_en?: string;

  @ApiPropertyOptional()
  name_de?: string;

  @ApiPropertyOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  name_es?: string;

  @ApiPropertyOptional()
  name_tr?: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  longitude?: number;

  @ApiPropertyOptional()
  city?: CityResponseDto;

  @ApiPropertyOptional()
  display_name?: string;
}

export class PoiResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description_short?: string;

  @ApiPropertyOptional()
  iata_code?: string;

  @ApiPropertyOptional()
  icao_code?: string;

  @ApiProperty({ description: 'Latitude' })
  latitude: number;

  @ApiProperty({ description: 'Longitude' })
  longitude: number;

  @ApiPropertyOptional()
  city?: CityResponseDto;

  @ApiPropertyOptional()
  district?: DistrictResponseDto;

  @ApiPropertyOptional({ description: 'Distance in km (only for proximity searches)' })
  distance_km?: number;
}

export class AutocompleteItemDto {
  @ApiProperty({ enum: ['country', 'city', 'district', 'poi'] })
  type: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  display_name: string;

  @ApiPropertyOptional()
  country_name?: string;

  @ApiPropertyOptional()
  region_name?: string;

  @ApiPropertyOptional()
  city_name?: string;

  @ApiProperty()
  slug: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}

export class SearchResultDto {
  @ApiProperty()
  countries: CountryResponseDto[];

  @ApiProperty()
  cities: CityResponseDto[];

  @ApiProperty()
  districts: DistrictResponseDto[];

  @ApiProperty()
  pois: PoiResponseDto[];

  @ApiProperty()
  total_results: number;
}
