import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ApplyDiscountDto {
    @ApiProperty({ example: 1, description: 'ID of the discount to apply' })
    @IsNotEmpty()
    @IsNumber()
    id: number;
}
