import { Controller, Get, Query, Param, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
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
  PoiResponseDto,
  AutocompleteItemDto,
  SearchResultDto,
  PaginatedResponseDto,
} from './dto/response.dto';

@ApiTags('Locations')
@Controller('locations')
@UseInterceptors(CacheInterceptor)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search for locations (countries, cities, districts, POIs)' })
  @ApiResponse({ status: 200, description: 'Search results', type: SearchResultDto })
  async search(@Query() dto: SearchLocationDto): Promise<SearchResultDto> {
    return this.locationsService.search(dto);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete suggestions for location search' })
  @ApiResponse({ status: 200, description: 'Autocomplete suggestions', type: [AutocompleteItemDto] })
  async autocomplete(@Query() dto: AutocompleteDto): Promise<AutocompleteItemDto[]> {
    return this.locationsService.autocomplete(dto);
  }

  @Get('countries')
  @ApiOperation({ summary: 'Get list of countries with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of countries' })
  async getCountries(@Query() dto: CountryFilterDto): Promise<PaginatedResponseDto<CountryResponseDto>> {
    return this.locationsService.getCountries(dto);
  }

  @Get('countries/:id')
  @ApiOperation({ summary: 'Get country details by ID' })
  @ApiResponse({ status: 200, description: 'Country details', type: CountryResponseDto })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async getCountryById(
    @Param('id') id: string,
    @Query('language') language?: string
  ): Promise<CountryResponseDto> {
    return this.locationsService.getCountryById(id, language);
  }

  @Get('cities')
  @ApiOperation({ summary: 'Get list of cities with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async getCities(@Query() dto: CityFilterDto): Promise<PaginatedResponseDto<CityResponseDto>> {
    return this.locationsService.getCities(dto);
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Get city details by ID including districts and POIs' })
  @ApiResponse({ status: 200, description: 'City details', type: CityResponseDto })
  @ApiResponse({ status: 404, description: 'City not found' })
  async getCityById(
    @Param('id') id: string,
    @Query('language') language?: string
  ): Promise<CityResponseDto> {
    return this.locationsService.getCityById(id, language);
  }

  @Get('poi')
  @ApiOperation({ summary: 'Get list of points of interest with filters' })
  @ApiResponse({ status: 200, description: 'List of POIs', type: [PoiResponseDto] })
  async getPois(@Query() dto: PoiFilterDto): Promise<PaginatedResponseDto<PoiResponseDto>> {
    return this.locationsService.getPois(dto);
  }
}
