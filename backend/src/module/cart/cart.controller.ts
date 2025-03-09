import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  // [POST]: /cart/add
  @Post('add')
  @Public()
  @ApiOperation({ summary: 'Add products to cart' })
  @ApiResponse({ status: 201, description: 'Products added successfully' })
  @ApiBody({ type: CreateCartDto })
  async create(@Body() createCartDto: CreateCartDto, @Req() req: Request & { session: any }) {
    return await this.cartService.create(createCartDto, req);
  }

  // [GET]: /cart
  @Get()
  @Public()
  @ApiOperation({ summary: 'List products in cart' })
  @ApiResponse({ status: 200, description: 'List products in cart' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { session: any }
  ) {
    return await this.cartService.findAll(req, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
