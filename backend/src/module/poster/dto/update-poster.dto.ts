import { ApiProperty } from '@nestjs/swagger';
import { CreatePosterDto } from './create-poster.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePosterDto extends CreatePosterDto {
    @ApiProperty({ example: '/link_poster', description: `Poster image's link` })
    @IsNotEmpty({ message: `Poster image's link must not be empty` })
    @IsString({ message: `Poster image's link must be string` })
    link: string
}
