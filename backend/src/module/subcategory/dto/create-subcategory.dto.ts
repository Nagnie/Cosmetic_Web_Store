import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({ example: 'Skincare', description: `Subcategory's name` })
  @IsNotEmpty({ message: `Subcategory's name must not be empty` })
  @IsString({ message: `Subcategory's name must be a string` })
  subcat_name: string;

  @ApiProperty({ example: 1, description: `Category ID this subcategory belongs to` })
  @IsNotEmpty({ message: `Category ID must not be empty` })
  @IsNumber({}, { message: `Category ID must be a number` })
  id_cat: number;
}
