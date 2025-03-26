import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreatePosterDto } from './dto/create-poster.dto';
import { UpdatePosterDto } from './dto/update-poster.dto';

@Injectable()
export class PosterService {
    constructor(
        private readonly dataSource: DataSource
    ) { }

    async create(createPosterDto: CreatePosterDto) {
        const { link } = createPosterDto;

        const insertedPoster = await this.dataSource.query(
            `
            INSERT INTO poster(link)
            VALUES($1)
            RETURNING *
            `,
            [link]
        );

        const id_post = insertedPoster[0]?.id_post;
        return {
            statusCode: 201,
            message: `Poster "${id_post}" created successfully`,
            data: id_post,
        };
    }

    async findAll(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const data = await this.dataSource.query(
            `
            SELECT * 
            FROM poster AS post
            LIMIT $1 OFFSET $2
            `,
            [limit, offset]
        );

        const totalQuery = await this.dataSource.query(`
            SELECT COUNT(post.id_post) AS total_items
            FROM poster AS post
        `);

        const total_items = Number(totalQuery[0]?.total_items || 0);
        const total_pages = Math.ceil(total_items / limit);

        return {
            message: "All posters",
            page: page,
            limit: limit,
            total_pages: total_pages,
            total_items: total_items,
            data: data,
        };
    }

    async update(id_post: number, updatePosterDto: UpdatePosterDto) {
        const { link } = updatePosterDto;

        await this.dataSource.query(
            `
            UPDATE poster
            SET link = $2
            WHERE id_post = $1;
        `,
            [id_post, link]
        );

        return { message: "Poster updated successfully", id_post };
    }

    async remove(id_post: number) {
        const data = await this.dataSource.query(
            `
        DELETE FROM poster WHERE id_post = $1
        RETURNING *;
        `,
            [id_post]
        );
        return {
            message: "Poster deleted successfully", id_post
        };
    }
}
