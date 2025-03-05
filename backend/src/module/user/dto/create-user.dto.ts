import { IsEmail, IsInt, IsNotEmpty, Length } from "class-validator";
import { User } from "@/module/user/entities/user.entity";
import { Expose, Transform } from "class-transformer";
import * as moment from 'moment';

export class CreateUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}