import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Skincare', description: `Category's name` })
  @IsNotEmpty({ message: `Category's name must not be empty` })
  @IsString({ message: `Category's name must be string` })
  cat_name: string;
}
