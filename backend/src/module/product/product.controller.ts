import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ResponseDto } from '@/helpers/utils';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  // [POST]: /product/create
  @Post('create')
  @Public()
  @ApiOperation({ summary: 'Create a new product', description: 'Add a new product along with multiple images.' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation error.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get("brand")
  @ApiOperation({ summary: 'Get product by brand', description: 'Get product by brand name' })
  @ApiQuery({name: "brand", required: true, example: "Dove"})
  @ApiQuery({name: "page", required: false, example: 1, default: 1})
  @ApiQuery({name: "limit", required: false, example: 5, default: 5})
  @ApiResponse({type: ResponseDto})
  @Public()
  async getProductsByBrand(@Req() req: Request) {
    return await this.productService.getProductsByBrand(req);
  }

  @Get("category")
  @ApiOperation({ summary: 'Get product by category', description: 'Get product by sub_category name' })
  @ApiQuery({name: "category", required: false, example: "makeup"})
  @ApiQuery({name: "subcate", required: false, example: "shampoo"})
  @ApiQuery({name: "page", required: false, example: 1, default: 1})
  @ApiQuery({name: "limit", required: false, example: 5, default: 5})
  @ApiResponse({type: ResponseDto})
  @Public()
  async getProductsByCategory(@Req() req: Request) {
    return await this.productService.getProductsByCategory(req);
  }

  @Get("search")
  @Public()
  @ApiOperation({ summary: 'Search products', description: 'Search product by name, cate name, subcate name & brand name' })
  @ApiResponse({ status: 200, description: 'List products' })
  @ApiResponse({ status: 500, description: 'Failed to search products' })
  @ApiQuery({name: "key", required: false, example: "toner"})
  @ApiQuery({name: "category", required: false, example: ""})
  @ApiQuery({name: "subcate", required: false, example: ""})
  @ApiQuery({name: "brand", required: false, example: ""})
  @ApiQuery({name: "minPrice", required: false, example: 400})
  @ApiQuery({name: "maxPrice", required: false, example: 500})
  @ApiQuery({name: "sortBy", required: false, enum: ["price", "name", "id"], example: "price"})
  @ApiQuery({name: "orderBy", required: false, enum: ["ASC", "DESC"], example: "ASC"})
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 5, description: 'Number of records per page' })
  async searchProdcut(@Req() req: Request) {
    return await this.productService.searchAndFilter(req);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Get all products' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productService.findAll(Number(page), Number(limit));
  }

  @Get('same_brand')
  @Public()
  @ApiOperation({ summary: 'Get same brand product by brand name' })
  @ApiQuery({ name: 'bra_name', required: true, example: 'Dior', description: 'Brand name' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  @ApiResponse({ status: 200, description: 'Same product' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findSameBrand(
    @Query('bra_name') bra_name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 4
  ){
    return await this.productService.findSameBrand(bra_name, Number(page), Number(limit));
  }

  @Get('same_subcategory')
  @Public()
  @ApiOperation({ summary: 'Get same subcategory product by subcategory name' })
  @ApiQuery({ name: 'scat_name', required: true, example: 'Lipstick', description: 'Subcategory name' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 4, description: 'Number of records per page' })
  @ApiResponse({ status: 200, description: 'Same product' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findSameSubcategory(
    @Query('scat_name') scat_name: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ){
    return await this.productService.findSameSubcategory(scat_name, Number(page), Number(limit));
  }

  @Get(':id_pro')
  @Public()
  @ApiOperation({ summary: 'Get detail product by ID' })
  @ApiParam({ name: 'id_pro', required: true, type: Number, description: `Product's ID` })
  @ApiResponse({ status: 200, description: 'Detail product' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id_pro') id_pro: string) {
    return await this.productService.findOne(Number(id_pro));
  }

  @Patch('update/:id_pro')
  @Public()
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id_pro', required: true, type: Number, description: `Product's ID` })
  @ApiResponse({ status: 200, description: 'Update successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(@Param('id_pro') id_pro: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(Number(id_pro), updateProductDto);
  }

  @Delete('delete/:id_pro')
  @Public()
  @ApiOperation({ summary: 'Delete one product by ID' })
  @ApiParam({ name: 'id_pro', type: Number, description: `Product's ID` })
  @ApiResponse({ status: 200, description: 'Delete successfully' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async remove(@Param('id_pro') id_pro: string) {
    return await this.productService.remove(Number(id_pro));
  }
}
