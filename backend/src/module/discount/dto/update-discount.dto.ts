import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-discount.dto';
import { IsOptional } from 'class-validator';
import { ApiBody, ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels(CreateDiscountDto)
export class UpdateDiscountDto extends OmitType(PartialType(CreateDiscountDto), ["unit"]) {
}
