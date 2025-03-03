import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('subcategory')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(+id);
  }
}
