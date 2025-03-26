import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/helpers/decorator/public';
import { SortField } from './enum/combo_sortfield.enum';
import { Request } from 'express';
import { ComboStatus } from './enum/combo_status.enum';

@Controller('combo')
export class ComboController {
  constructor(private readonly comboService: ComboService) { }

  @Post()
  @Public()
  @ApiOperation({summary: "Create combo"})
  @ApiResponse({status: 201, description: "Successfully"})
  @ApiBody({type: CreateComboDto})
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
  }

  @Get("searchAndFilter")
  @Public()
  @ApiOperation({summary: "Search And Filter combo"})
  @ApiQuery({ name: "name", required: false, example: "Combo 1", default: "", description: "Combo name"})
  @ApiQuery({ name: "status", enum: ComboStatus, required: false, example: "available", default: "available", description: "Combo status"})
  @ApiQuery({ name: 'page', required: false, example: 1, default: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 5, default: 5, description: 'Number of records per page' })
  @ApiQuery({ name: "sortBy", enum: SortField, required: false, example: "id", default: "value", description: "Sort by field"})
  @ApiQuery({ name: "orderBy", required: false, example: "ACS", default: "ACS", description: "Order by field"})
  async searchAndFilter(@Req() req: Request) {
    return await this.comboService.searchAndFilter(req);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all combos' })
  @ApiResponse({ status: 200, description: 'Get all combos' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return await this.comboService.findAll(Number(page), Number(limit));
  }

  @Get(':id_combo')
  @Public()
  @ApiOperation({ summary: 'Get detail combo by ID' })
  @ApiParam({ name: 'id_combo', required: true, type: Number, description: `Combo's ID` })
  @ApiResponse({ status: 200, description: 'Detail combo' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id_combo') id_combo: string) {
    return await this.comboService.findOne(Number(id_combo));
  }

  @Patch(':id')
  @Public()
  @ApiOperation({summary: "Update combo", description: "Only send fields need to update"})
  @ApiParam({name: "id", required: true, example: 1, description: "Combo id"})
  @ApiBody({type: UpdateComboDto})
  @ApiResponse({status: 200, description: "Successfully"})
  @ApiResponse({status: 500, description: "Combo not existed"})
  update(@Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
    return this.comboService.update(+id, updateComboDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({summary: "Delete combo"})
  @ApiParam({name: "id", required: true, example: 7, description: "Combo id"})
  @ApiResponse({status: 200, description: "Successfully"})
  @ApiResponse({status: 400, description: "Combo not existed"})
  remove(@Param('id') id: string) {
    return this.comboService.remove(+id);
  }
}
