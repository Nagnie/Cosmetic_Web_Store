import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response, Request } from 'express';
import axios from 'axios';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  // [GET]: /order/list-product
  @Get('list-product')
  @Public()
  @ApiOperation({ summary: 'Get all list products in cart' })
  @ApiResponse({ status: 200, description: 'Get all list products in cart' })
  async listItems(@Req() req: Request & { session: any }) {
    return this.orderService.getListProduct(req);
  }

  // [POST]: /order/finish
  @Post('finish')
  @Public()
  @ApiOperation({ summary: 'Finish order' })
  @ApiResponse({ status: 201, description: 'Order successfully' })
  @ApiBody({ type: CreateOrderDto })
  async create(@Req() req: Request & { session: any }, @Body() createOrderDto: CreateOrderDto) {
    return await this.orderService.create(req, createOrderDto);
  }

  @Get('download-invoice')
  @Public()
  async downloadInvoice(
    @Res() res: Response,
    @Query('url') url: string,
    @Query('publicId') publicId: string,
  ) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${publicId}.png"`);
      res.send(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Download failed' });
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Get all orders' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(@Req() req: Request) {
    return this.orderService.findAll(req);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get detail orders' })
  @ApiResponse({ status: 200, description: 'Detail orders' })
  @ApiResponse({status: 500, description: 'Internal server error'})
  @ApiParam({name: "id", required: true, example: 5, description: "Order id"})
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number (for product paginating)' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page (for product paginating)' })
  findOne(@Param('id') orderId: string, @Req() req: Request) {
    return this.orderService.findOne(+orderId, req);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Update read & order status' })
  @ApiParam({name: "id", required: true, description: "Order id"})
  @ApiBody({type: UpdateOrderDto})
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({status: 500, description: 'Internal server error'})
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return await this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @Public()
  @ApiParam({name: "id", required: true, description: "Order id"})
  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 200, description: 'Successfully' })
  @ApiResponse({status: 500, description: 'Internal server error'})
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
