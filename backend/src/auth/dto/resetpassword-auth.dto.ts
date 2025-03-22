import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetpassAuthDto extends PartialType(CreateAuthDto) {
    @ApiProperty({
        name: "email",
        default: "admin@gmail.com"
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        name: "newPassword",
        default: "123456789"
    })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
