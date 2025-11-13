import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import {
  CreateCountryDto,
  UpdateCountryDto,
  CreateRegionDto,
  UpdateRegionDto,
  CreateCityDto,
  UpdateCityDto,
  CreateDistrictDto,
  UpdateDistrictDto,
  CreatePoiDto,
  UpdatePoiDto,
  CreateAliasDto,
} from './dto/admin.dto';

// Simple API key guard (replace with proper auth in production)
// @UseGuards(AdminGuard)
@ApiTags('Admin - Locations')
@Controller('admin/locations')
@ApiBearerAuth()
export class AdminLocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // ==================== COUNTRIES ====================

  @Post('countries')
  @ApiOperation({ summary: 'Create a new country' })
  @ApiResponse({ status: 201, description: 'Country created successfully' })
  async createCountry(@Body() dto: CreateCountryDto) {
    return this.locationsService.createCountry(dto);
  }

  @Patch('countries/:id')
  @ApiOperation({ summary: 'Update country details' })
  @ApiResponse({ status: 200, description: 'Country updated successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async updateCountry(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.locationsService.updateCountry(id, dto);
  }

  @Delete('countries/:id')
  @ApiOperation({ summary: 'Delete a country' })
  @ApiResponse({ status: 200, description: 'Country deleted successfully' })
  @ApiResponse({ status: 404, description: 'Country not found' })
  async deleteCountry(@Param('id') id: string) {
    return this.locationsService.deleteCountry(id);
  }

  // ==================== REGIONS ====================

  @Post('regions')
  @ApiOperation({ summary: 'Create a new region' })
  @ApiResponse({ status: 201, description: 'Region created successfully' })
  async createRegion(@Body() dto: CreateRegionDto) {
    return this.locationsService.createRegion(dto);
  }

  @Patch('regions/:id')
  @ApiOperation({ summary: 'Update region details' })
  @ApiResponse({ status: 200, description: 'Region updated successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async updateRegion(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    // Implement in service if needed
    return { message: 'Not implemented yet' };
  }

  @Delete('regions/:id')
  @ApiOperation({ summary: 'Delete a region' })
  @ApiResponse({ status: 200, description: 'Region deleted successfully' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async deleteRegion(@Param('id') id: string) {
    return this.locationsService.deleteRegion(id);
  }

  // ==================== CITIES ====================

  @Post('cities')
  @ApiOperation({ summary: 'Create a new city' })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  async createCity(@Body() dto: CreateCityDto) {
    return this.locationsService.createCity(dto);
  }

  @Patch('cities/:id')
  @ApiOperation({ summary: 'Update city details' })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async updateCity(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.locationsService.updateCity(id, dto);
  }

  @Delete('cities/:id')
  @ApiOperation({ summary: 'Delete a city' })
  @ApiResponse({ status: 200, description: 'City deleted successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  async deleteCity(@Param('id') id: string) {
    return this.locationsService.deleteCity(id);
  }

  // ==================== DISTRICTS ====================

  @Post('districts')
  @ApiOperation({ summary: 'Create a new district' })
  @ApiResponse({ status: 201, description: 'District created successfully' })
  async createDistrict(@Body() dto: CreateDistrictDto) {
    return this.locationsService.createDistrict(dto);
  }

  @Patch('districts/:id')
  @ApiOperation({ summary: 'Update district details' })
  @ApiResponse({ status: 200, description: 'District updated successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  async updateDistrict(@Param('id') id: string, @Body() dto: UpdateDistrictDto) {
    return { message: 'Not implemented yet' };
  }

  @Delete('districts/:id')
  @ApiOperation({ summary: 'Delete a district' })
  @ApiResponse({ status: 200, description: 'District deleted successfully' })
  @ApiResponse({ status: 404, description: 'District not found' })
  async deleteDistrict(@Param('id') id: string) {
    return this.locationsService.deleteDistrict(id);
  }

  // ==================== POIs ====================

  @Post('poi')
  @ApiOperation({ summary: 'Create a new point of interest' })
  @ApiResponse({ status: 201, description: 'POI created successfully' })
  async createPoi(@Body() dto: CreatePoiDto) {
    return this.locationsService.createPoi(dto);
  }

  @Patch('poi/:id')
  @ApiOperation({ summary: 'Update POI details' })
  @ApiResponse({ status: 200, description: 'POI updated successfully' })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async updatePoi(@Param('id') id: string, @Body() dto: UpdatePoiDto) {
    return { message: 'Not implemented yet' };
  }

  @Delete('poi/:id')
  @ApiOperation({ summary: 'Delete a POI' })
  @ApiResponse({ status: 200, description: 'POI deleted successfully' })
  @ApiResponse({ status: 404, description: 'POI not found' })
  async deletePoi(@Param('id') id: string) {
    return this.locationsService.deletePoi(id);
  }

  // ==================== ALIASES ====================

  @Post('aliases')
  @ApiOperation({ summary: 'Create a location alias for alternative names/search terms' })
  @ApiResponse({ status: 201, description: 'Alias created successfully' })
  async createAlias(@Body() dto: CreateAliasDto) {
    return this.locationsService.createAlias(dto);
  }

  @Delete('aliases/:id')
  @ApiOperation({ summary: 'Delete an alias' })
  @ApiResponse({ status: 200, description: 'Alias deleted successfully' })
  @ApiResponse({ status: 404, description: 'Alias not found' })
  async deleteAlias(@Param('id') id: string) {
    return this.locationsService.deleteAlias(id);
  }
}
