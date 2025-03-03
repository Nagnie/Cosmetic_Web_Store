import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  // [POST]: /subcategory/create
  @Post('create')
  @Public()
  @ApiOperation({ summary: 'Create a new Subcategory' })
  @ApiResponse({ status: 201, description: 'Subcategory created successfully' })
  @ApiResponse({ status: 400, description: 'Subcategory already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subcat_name: { type: 'string', example: 'New' },
        id_cat: { type: 'number', example: '1' }
      },
      required: ['subcat_name'],
    },
  })
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return await this.subcategoryService.create(createSubcategoryDto);
  }

  // [GET]: /subcategory
  @Get()
  @Public()
  @ApiOperation({ summary: 'List subcategories and number of products' })
  @ApiResponse({ status: 200, description: 'List subcategories and number of products' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.subcategoryService.findAll(page, limit);
  }

  // [PATCH]: /subcategory/update/:id_subcat
  @Patch('update/:id_subcat')
  @Public()
  @ApiOperation({ summary: 'Update a subcategory' })
  @ApiParam({ name: 'id_subcat', type: 'integer', description: 'Subcategory ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subcat_name: { type: 'string', example: 'New Subcategory Name' },
        id_cat: { type: 'integer', example: 2 },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Subcategory updated successfully' })
  @ApiResponse({ status: 404, description: 'Subcategory not found' })
  async update(@Param('id_subcat') id_subcat: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return await this.subcategoryService.update(Number(id_subcat), updateSubcategoryDto);
  }

  // [DELETE]: /subcategory/delete/:id_subcat
  @Delete('delete/:id_subcat')
  @Public()
  @ApiOperation({ summary: 'Delete one subcategory by ID' })
  @ApiParam({ name: 'id_subcat', type: Number, description: `Subcategory's ID` })
  @ApiResponse({ status: 200, description: 'Delete successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id_subcat') id_subcat: string) {
    return await this.subcategoryService.remove(Number(id_subcat));
  }
}
