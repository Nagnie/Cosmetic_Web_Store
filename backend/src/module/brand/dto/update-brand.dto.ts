import { CreateBrandDto } from './create-brand.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBrandDto extends CreateBrandDto {
    @IsNotEmpty()
    name: string;
}
