import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Request } from 'express';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ResponseDto } from '@/helpers/utils';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({ type: ResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, validation error.' })
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all brands' })
  @ApiQuery({name: 'page', type: Number, required: false, description: 'The page number', example: 1})
  @ApiQuery({name: 'limit', type: Number, required: false, description: 'The number of item per page', example: 5})
  @ApiQuery({name: 'sortBy', type: String, required: false, description: 'The name of property to sort', example: 'id'})
  @ApiQuery({name: 'order', type: String, required: false, description: 'The direction to sort', example: 'ASC'})
  @ApiResponse({ status: 200, description: 'Get all brands successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll(@Req() req: Request) {
    return this.brandService.findAll(req);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a brand by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand to get', required: true })
  @ApiResponse({ status: 200, description: 'Brand found successfully.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update brand by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand to update', required: true })
  @ApiBody({ type: UpdateBrandDto })
  @ApiResponse({ status: 200, description: 'Brand updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request, validation error.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID of the brand to delete', required: true })
  @ApiResponse({ status: 200, description: 'Brand removed successfully.' })
  @ApiResponse({ status: 404, description: 'Brand not found.' })
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
