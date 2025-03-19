import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Request } from 'express';
import { Public } from '@/helpers/decorator/public';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Public()
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @Public()
  findAll(@Req() req: Request) {
    return this.discountService.findAll(req);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string, @Param('code') code: string) {
    return this.discountService.findOne(+id, code);
  }

  @Patch(':id')
  @Public()
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  @Public()
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
