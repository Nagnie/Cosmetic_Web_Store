import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Request } from 'express';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Discount } from './entities/discount.entity';
import { SortField } from './enum/sort_field.enum';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Public()
  @ApiOperation({summary: "Create discount"})
  @ApiResponse({status: 201, description: "Successfully"})
  @ApiBody({type: CreateDiscountDto})
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @Public()
  @ApiOperation({summary: "Get all discounts"})
  @ApiQuery({ name: 'page', required: false, example: 1, default: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 5, default: 5, description: 'Number of records per page' })
  @ApiQuery({ name: "sortBy", required: false, example: "id", default: "id", description: "Sort by field"})
  @ApiQuery({ name: "orderBy", required: false, example: "ACS", default: "ACS", description: "Order by field"})
  @ApiResponse({status: 200, description: "Successfully"})
  findAll(@Req() req: Request) {
    return this.discountService.findAll(req);
  }

  @Get(':id/:code')
  @Public()
  @ApiOperation({ summary: "Get discount by id or code"})
  @ApiParam({ name: "id", required: false, example: 1, description: "Discount id"})
  @ApiParam({ name: "code", required: false, example: "FREESHIP", description: "Discount code"})
  @ApiResponse({status: 200, description: "Successfully"})
  @ApiResponse({status: 500, description: "Discount not existed"})
  findOne(@Param('id') id: string, @Param('code') code: string) {
    return this.discountService.findOne(+id, code);
  }

  @Get("searchAndFilter")
  @Public()
  @ApiOperation({summary: "Search And Filter discounts"})
  @ApiQuery({ name: "code", required: false, example: "FREESHIP", default: "%", description: "Discount code"})
  @ApiQuery({ name: 'page', required: false, example: 1, default: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 5, default: 5, description: 'Number of records per page' })
  @ApiQuery({ name: "sortBy", enum: SortField, required: false, example: "id", default: "value", description: "Sort by field"})
  @ApiQuery({ name: "orderBy", required: false, example: "ACS", default: "ACS", description: "Order by field"})
  @ApiResponse({status: 200, description: "Successfully"})
  async searchAndFilter(@Req() req: Request) {
    return await this.discountService.searchAndFilter(req);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({summary: "Update discount", description: "Only send fields need to update, but except 'unit' field"})
  @ApiParam({name: "id", required: true, example: 1, description: "Discount id"})
  @ApiBody({type: UpdateDiscountDto})
  @ApiResponse({status: 200, description: "Successfully"})
  @ApiResponse({status: 500, description: "Discount not existed"})
  update(@Param('id') id: string, @Body() updateDiscountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({summary: "Delete discount"})
  @ApiParam({name: "id", required: true, example: 1, description: "Discount id"})
  @ApiResponse({status: 200, description: "Successfully"})
  @ApiResponse({status: 400, description: "Discount not existed"})
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
