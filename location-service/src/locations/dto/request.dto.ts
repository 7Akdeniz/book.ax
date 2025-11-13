import { IsString, IsOptional, IsInt, Min, Max, IsEnum, IsBoolean, IsNumber, IsArray, IsUUID, MinLength, MaxLength } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SupportedLanguage {
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  TR = 'tr'
}

export class PaginationDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class SearchLocationDto extends PaginationDto {
  @ApiProperty({ description: 'Search query' })
  @IsString()
  @MinLength(1)
  q: string;

  @ApiPropertyOptional({ description: 'Filter by country ISO2 code' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ enum: ['country', 'city', 'district', 'poi'] })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: 'en' })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage = SupportedLanguage.EN;

  @ApiPropertyOptional({ description: 'Latitude for proximity search' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  near_lat?: number;

  @ApiPropertyOptional({ description: 'Longitude for proximity search' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  near_lng?: number;

  @ApiPropertyOptional({ description: 'Radius in kilometers', default: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  radius_km?: number = 50;
}

export class AutocompleteDto {
  @ApiProperty({ description: 'Search query', minLength: 2 })
  @IsString()
  @MinLength(2)
  q: string;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: 'en' })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage = SupportedLanguage.EN;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  limit?: number = 10;
}

export class CountryFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by continent code' })
  @IsString()
  @IsOptional()
  continent?: string;

  @ApiPropertyOptional({ description: 'Search by country name' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: 'en' })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage = SupportedLanguage.EN;
}

export class CityFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by country ISO2 code' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ description: 'Filter by region ID' })
  @IsUUID()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ description: 'Search by city name' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ description: 'Only major cities' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  is_major_city?: boolean;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: 'en' })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage = SupportedLanguage.EN;
}

export class PoiFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by city ID' })
  @IsUUID()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Filter by POI type' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: 'Search by POI name' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ description: 'Latitude for proximity search' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  near_lat?: number;

  @ApiPropertyOptional({ description: 'Longitude for proximity search' })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  near_lng?: number;

  @ApiPropertyOptional({ description: 'Radius in kilometers', default: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(1000)
  @IsOptional()
  radius_km?: number = 50;

  @ApiPropertyOptional({ enum: SupportedLanguage, default: 'en' })
  @IsEnum(SupportedLanguage)
  @IsOptional()
  language?: SupportedLanguage = SupportedLanguage.EN;
}
