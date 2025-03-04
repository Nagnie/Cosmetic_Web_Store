import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @IsOptional()
    @ApiProperty({ example: 'New name', required: false, description: 'This is new name of the category' })
    cat_name: string;   
}
