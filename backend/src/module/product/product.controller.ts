import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

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

  @Get()
  @Public()
  @ApiOperation({ summary: 'List products' })
  @ApiResponse({ status: 200, description: 'List products' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.productService.findAll(Number(page), Number(limit));
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
