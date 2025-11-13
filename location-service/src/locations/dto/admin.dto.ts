import { IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCountryDto {
  @ApiProperty()
  @IsUUID()
  continent_id: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  iso2: string;

  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(3)
  iso3: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  numeric_code?: string;

  @ApiProperty()
  @IsString()
  name_official: string;

  @ApiProperty()
  @IsString()
  name_en: string;

  @ApiProperty()
  @IsString()
  name_de: string;

  @ApiProperty()
  @IsString()
  name_fr: string;

  @ApiProperty()
  @IsString()
  name_es: string;

  @ApiProperty()
  @IsString()
  name_tr: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  capital?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone_code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  timezones?: string[];
}

export class UpdateCountryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_official?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  capital?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone_code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsOptional()
  timezones?: string[];
}

export class CreateRegionDto {
  @ApiProperty()
  @IsUUID()
  country_id: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;
}

export class UpdateRegionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;
}

export class CreateCityDto {
  @ApiProperty()
  @IsUUID()
  country_id: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  region_id?: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_capital?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_major_city?: boolean;
}

export class UpdateCityDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_capital?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_major_city?: boolean;
}

export class CreateDistrictDto {
  @ApiProperty()
  @IsUUID()
  city_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class UpdateDistrictDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_de?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_fr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_es?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name_tr?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;
}

export class CreatePoiDto {
  @ApiProperty()
  @IsUUID()
  city_id: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  district_id?: string;

  @ApiProperty()
  @IsEnum(['AIRPORT', 'TRAIN_STATION', 'BUS_STATION', 'PORT', 'ATTRACTION', 'MUSEUM', 'PARK', 'BEACH', 'SHOPPING', 'STADIUM', 'ARENA', 'UNIVERSITY', 'BUSINESS_DISTRICT', 'CONVENTION_CENTER', 'HOSPITAL', 'LANDMARK', 'MONUMENT', 'CASTLE', 'PALACE', 'CHURCH', 'MOSQUE', 'TEMPLE', 'RESTAURANT_AREA', 'NIGHTLIFE', 'MARKET', 'EXHIBITION_CENTER', 'THEATER', 'OPERA_HOUSE', 'ZOO', 'AQUARIUM', 'THEME_PARK', 'SKI_RESORT', 'GOLF_COURSE', 'CASINO', 'SPA'])
  type: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description_short?: string;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iata_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icao_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  external_id?: string;
}

export class UpdatePoiDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description_short?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iata_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icao_code?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  external_id?: string;
}

export class CreateAliasDto {
  @ApiProperty({ enum: ['COUNTRY', 'REGION', 'CITY', 'DISTRICT', 'POI'] })
  @IsEnum(['COUNTRY', 'REGION', 'CITY', 'DISTRICT', 'POI'])
  target_type: string;

  @ApiProperty()
  @IsUUID()
  target_id: string;

  @ApiProperty()
  @IsString()
  alias_name: string;

  @ApiProperty()
  @IsString()
  language_code: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  use_for_search?: boolean;
}
