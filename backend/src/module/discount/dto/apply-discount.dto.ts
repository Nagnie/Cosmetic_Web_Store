import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ApplyDiscountDto {
    @ApiProperty({ example: 1, description: 'Code of the discount to apply' })
    @IsNotEmpty()
    @IsString({ message: `Discount's code must be string` })
    code: string;
}
