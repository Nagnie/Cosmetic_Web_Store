import { Injectable } from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class SubcategoryService {
  constructor(
    private readonly dataSource: DataSource
  ) { }

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { subcat_name, id_cat } = createSubcategoryDto;

    // Check exist
    const existingSubcategory = await this.dataSource.query(`
    SELECT * FROM sub_category WHERE name = $1;
  `, [subcat_name]);

    if (existingSubcategory.length > 0) {
      return {
        statusCode: 400,
        message: `Category "${subcat_name}" already exists`
      }
    }

    // If not exist
    const data = await this.dataSource.query(`
      INSERT INTO sub_category(name, id_cat) VALUES ($1, $2) 
      RETURNING *;
    `, [subcat_name, id_cat]);

    return {
      statusCode: 201,
      message: `Subcategory "${subcat_name}" created successfully`,
      data: data[0]
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const data = await this.dataSource.query(`
        SELECT scat.name AS scat_name, cat.name AS cat_name, COUNT(p.id_pro) AS num_pro
        FROM sub_category AS scat
        JOIN category AS cat ON scat.id_cat = cat.id_cat
        LEFT JOIN product AS p ON p.id_subcat = scat.id_subcat
        GROUP BY scat.id_subcat, scat.name, cat.name
        LIMIT $1 OFFSET $2
      `, [limit, offset]);

    const totalQuery = await this.dataSource.query(`
        SELECT COUNT(scat.id_subcat) AS total_items
        FROM sub_category AS scat
      `);
    const total_items = Number(totalQuery[0]?.total_items || 0);
    const total_pages = Math.ceil(total_items / limit);

    return {
      message: "All sub categories",
      page: page,
      limit: limit,
      total_pages: total_pages,
      total_items: total_items,
      data: data,
    }
  }

  async update(id_subcat: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    const { subcat_name, id_cat } = updateSubcategoryDto;

    const data = await this.dataSource.query(`
      UPDATE sub_category
      SET name = $1, id_cat = $2
      WHERE id_subcat = $3
      RETURNING *;
    `,
      [subcat_name, id_cat, id_subcat]);

    return data.length > 0 ? data[0] : null;
  }

  async remove(id_subcat: number) {
    const data = await this.dataSource.query(`
      DELETE FROM sub_category WHERE id_subcat = $1
      RETURNING *;
    `, [id_subcat])

    return data[0];
  }
}
