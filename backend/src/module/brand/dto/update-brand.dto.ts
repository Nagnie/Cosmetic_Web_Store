import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBrandDto extends CreateBrandDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}
