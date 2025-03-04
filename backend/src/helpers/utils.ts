import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { v4 as uuidv4 } from 'uuid';


const bcrypt = require('bcrypt');
const saltRounds = 10;

export const hashPassword = async (plainPassword : string) => {
    try {
        return await bcrypt.hash(plainPassword, saltRounds);
    } catch (error) {
        console.log(error);
    }
}

export const comparePassword = async (plainPassword : string, hashPassord: string) => {
    try {
        return await bcrypt.compare(plainPassword, hashPassord);
    } catch (error) {
        console.log(error);
    }
}

export class ResponseDto<T> {
    @ApiProperty({
        description: 'HTTP status code of the response',
        example: 200,
        type: Number,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Message providing additional information about the response',
        example: 'Successfully',
        type: String,
    })
    message: string;

    @ApiProperty({
        description: 'The actual data returned from the API',
        example: {},
        type: Object,
        required: false,
    })
    data: T;

    constructor(statusCode: number, message: string, data: T) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}
