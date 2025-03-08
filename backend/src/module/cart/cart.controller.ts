import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('add')
  @Public()
  @ApiOperation({ summary: 'Add products to cart' })
  @ApiResponse({ status: 201, description: 'Products added successfully' })
  @ApiBody({ type: CreateCartDto })
  async create(@Body() createCartDto: CreateCartDto, @Req() req: Request & { session: any }) {
    return await this.cartService.create(createCartDto, req);
  }

  @Get()
  async findAll() {
    return await this.cartService.findAll();
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
