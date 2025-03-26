import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PosterService } from './poster.service';
import { Public } from '@/helpers/decorator/public';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreatePosterDto } from './dto/create-poster.dto';
import { UpdatePosterDto } from './dto/update-poster.dto';

@Controller('poster')
export class PosterController {
    constructor(private readonly posterService: PosterService) { }

    // [POST]: /poster/create
    @Post('create')
    @Public()
    @ApiOperation({ summary: 'Create a new poster' })
    @ApiBody({ type: CreatePosterDto })
    @ApiResponse({ status: 201, description: 'Poster created successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async create(@Body() createPosterDto: CreatePosterDto) {
        return await this.posterService.create(createPosterDto);
    }

    // [GET]: /poster
    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all posters' })
    @ApiResponse({ status: 200, description: 'Get all posters' })
    @ApiQuery({ name: 'page', required: false, example: 1, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Number of records per page' })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return await this.posterService.findAll(Number(page), Number(limit));
    }

    // [PATCH]: /poster/update/:id_post
    @Patch('update/:id_post')
    @Public()
    @ApiOperation({ summary: 'Update poster by ID' })
    @ApiParam({ name: 'id_pro', required: true, type: Number, description: `Poster's ID` })
    @ApiResponse({ status: 200, description: 'Update successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async update(@Param('id_post') id_post: string, @Body() updatePosterDto: UpdatePosterDto) {
        return await this.posterService.update(Number(id_post), updatePosterDto);
    }

    @Delete('delete/:id_post')
    @Public()
    @ApiOperation({ summary: 'Delete one poster by ID' })
    @ApiParam({ name: 'id_post', type: Number, description: `Poster's ID` })
    @ApiResponse({ status: 200, description: 'Delete successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async remove(@Param('id_post') id_post: string) {
        return await this.posterService.remove(Number(id_post));
    }
}
