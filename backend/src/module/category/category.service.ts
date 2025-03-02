import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    private readonly dataSource: DataSource
  ){

  }
  async findAll(){
    return await this.dataSource.query(`
        SELECT cat.name AS cat_name, COUNT(scat.id_subcat) AS num_subcat
        FROM category AS cat
        LEFT JOIN sub_category AS scat ON cat.id_cat = scat.id_cat
        GROUP BY cat.id_cat, cat.name
      `)
  }

  async findOne(id_cat: number){
    const data = await this.dataSource.query(`
      SELECT cat.id_cat AS id_cat, cat.name AS cat_name, scat.name AS scat_name
      FROM category AS cat
      LEFT JOIN sub_category AS scat ON cat.id_cat = scat.id_cat
      WHERE cat.id_cat = $1
      ORDER BY cat.id_cat
      `,
      [id_cat]
    );
    if(data.length == 0){
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

  async update(id_cat: number, updateCategory: UpdateCategoryDto){
    const { cat_name } = updateCategory;
    
    if(!cat_name || cat_name.trim() === ''){
      return { message: `Don't have data to update`}
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

  async delete(id_cat: number){
    const data = await this.dataSource.query(`
        DELETE FROM category WHERE id_cat = $1
        RETURNING *;
      `, [id_cat])

    return data[0];
  }
}
