import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComboService } from './combo.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/helpers/decorator/public';

@Controller('combo')
export class ComboController {
  constructor(private readonly comboService: ComboService) { }

  @Post()
  create(@Body() createComboDto: CreateComboDto) {
    return this.comboService.create(createComboDto);
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
  update(@Param('id') id: string, @Body() updateComboDto: UpdateComboDto) {
    return this.comboService.update(+id, updateComboDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comboService.remove(+id);
  }
}
