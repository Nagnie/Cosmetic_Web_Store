import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public } from '@/helpers/decorator/public';
import { Response, Request } from 'express';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import axios from 'axios';

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

  @Get('download-invoice')
  @Public()
  async downloadInvoice(
    @Res() res: Response,
    @Query('url') url: string,
    @Query('publicId') publicId: string,
  ) {
    try {
      // Fetch ảnh từ Cloudinary
      const response = await axios.get(url, { responseType: 'arraybuffer' });

      // Set header để tải file
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `attachment; filename="${publicId}.png"`);
      res.send(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Download failed' });
    }
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
}
