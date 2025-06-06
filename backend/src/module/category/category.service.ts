import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    private readonly dataSource: DataSource
  ) { }

  async create(createCategory: CreateCategoryDto) {
    const { cat_name } = createCategory;

    // Check exist
    const existingCategory = await this.dataSource.query(`
        SELECT * FROM category WHERE name = $1;
      `, [cat_name]);

    if (existingCategory.length > 0) {
      return {
        statusCode: 400,
        message: `Category "${cat_name}" already exists`
      }
    }

    // If not exist
    const data = await this.dataSource.query(`
        INSERT INTO category(name) VALUES ($1) 
        RETURNING *;
      `, [cat_name]);

    return {
      statusCode: 201,
      message: `Category "${cat_name}" created successfully`,
      data: data[0]
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const data = await this.dataSource.query(`
        SELECT cat.id_cat AS cat_id, cat.name AS cat_name, COUNT(scat.id_subcat) AS num_subcat,
        COALESCE((
          SELECT json_agg(jsonb_build_object('id_scat', scat.id_subcat, 'scat_name', scat.name))
          FROM sub_category AS scat
          WHERE scat.id_cat = cat.id_cat), '[]'::json
        ) AS sub_category
        FROM category AS cat
        LEFT JOIN sub_category AS scat ON cat.id_cat = scat.id_cat
        GROUP BY cat.id_cat, cat.name
        ORDER BY cat.id_cat ASC
        LIMIT $1 OFFSET $2
      `, [limit, offset])

    const totalQuery = await this.dataSource.query(`
        SELECT COUNT(cat.id_cat) AS total_items
        FROM category AS cat
      `);
    const total_items = Number(totalQuery[0]?.total_items || 0);
    const total_pages = Math.ceil(total_items / limit);

    return {
      message: "All categories",
      page: page,
      limit: limit,
      total_pages: total_pages,
      total_items: total_items,
      data: data,
    }
  }

  async findOne(id_cat: number) {
    const data = await this.dataSource.query(`
      SELECT cat.id_cat AS id_cat, cat.name AS cat_name, scat.name AS scat_name
      FROM category AS cat
      LEFT JOIN sub_category AS scat ON cat.id_cat = scat.id_cat
      WHERE cat.id_cat = $1
      ORDER BY cat.id_cat
      `,
      [id_cat]
    );
    if (data.length == 0) {
      return null;
    }

    const result = {
      id_cat: data[0].id_cat,
      cat_name: data[0].cat_name,
      sub_categories: data
        .map((row) => row.scat_name)
        .filter((name) => name != null) // Loại bỏ giá trị null nếu như category chưa có subcategory
    }

    return result;
  }

  async update(id_cat: number, updateCategory: UpdateCategoryDto) {
    const { cat_name } = updateCategory;

    if (!cat_name || cat_name.trim() === '') {
      return { message: `Don't have data to update` }
    }

    const data = await this.dataSource.query(`
        UPDATE category
        SET name = $1
        WHERE id_cat = $2
        RETURNING *;
      `,
      [cat_name, id_cat]);

    return data.length > 0 ? data[0] : null;
  }

  async remove(id_cat: number) {
    const data = await this.dataSource.query(`
        DELETE FROM category WHERE id_cat = $1
        RETURNING *;
      `, [id_cat])

    return data[0];
  }
}
