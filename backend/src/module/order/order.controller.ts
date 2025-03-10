import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from '@/helpers/decorator/public';
import { Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('finish')
  @Public()
  @ApiOperation({ summary: 'Finish order' })
  @ApiResponse({ status: 201, description: 'Order successfully' })
  @ApiBody({ type: CreateOrderDto })
  async create(@Req() req: Request & { session: any }, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(req, createOrderDto);
  }

  @Get()
  @Public()
  async findAll(@Req() req: Request) {
    return this.orderService.findAll(req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.orderService.findOne(+id, req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
