import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // [POST]: /category/create
  @Post('create')
  @Public()
  @ApiOperation({ summary: 'Create a new category' }) // Mô tả chức năng của API
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Category already exists' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cat_name: { type: 'string', example: 'Skincare' },
      },
      required: ['cat_name'],
    },
  })
  async create(@Body() createCategory: CreateCategoryDto){
    return await this.categoryService.create(createCategory);
  }
  // [GET]: /category
  @Get()
  @Public()
  @ApiOperation({ summary: 'List categories and number of subcategories' })
  @ApiResponse({ status: 200, description: 'List categories and number of subcategories' })
  async findAll(){
    return await this.categoryService.findAll();
  }

  // [GET]: /category/:id_cat
  @Get(':id_cat')
  @Public()
  @ApiOperation({ summary: 'Get detail category by ID' })
  @ApiParam({ name: 'id_cat', required: true, type: Number, description: `Category's ID` })
  @ApiResponse({ status: 200, description: 'Detail category' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id_cat') id_cat: string){
    return await this.categoryService.findOne(Number(id_cat));
  }

  // [PATCH]: /category/update/:id_cat
  @Patch('update/:id_cat')
  @Public()
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id_cat', required: true, type: Number, description: `Category's ID` })
  @ApiResponse({ status: 200, description: 'Update successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id_cat') id_cat: string, @Body() updateCategory: UpdateCategoryDto){
    return await this.categoryService.update(Number(id_cat), updateCategory)
  }

  // [DELETE]: /category/delete/:id_cat
  @Delete('delete/:id_cat')
  @Public()
  @ApiOperation({ summary: 'Delete one category by ID'})
  @ApiParam({ name: 'id_cat', type: Number, description: `Category's ID` })
  @ApiResponse({ status: 200, description: 'Delete successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Param('id_cat') id_cat: string){
    return await this.categoryService.delete(Number(id_cat));
  }
}
