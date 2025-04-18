import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateBrandDto extends CreateBrandDto {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    image: string;
}
