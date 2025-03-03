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

    return await this.dataSource.query(`
        SELECT scat.name AS scat_name, cat.name AS cat_name, COUNT(p.id_pro) AS num_pro
        FROM sub_category AS scat
        JOIN category AS cat ON scat.id_cat = cat.id_cat
        LEFT JOIN product AS p ON p.id_subcat = scat.id_subcat
        GROUP BY scat.id_subcat, scat.name, cat.name
        LIMIT $1 OFFSET $2
      `, [limit, offset])
  }

  findOne(id: number) {
    return `This action returns a #${id} subcategory`;
  }

  update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    return `This action updates a #${id} subcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subcategory`;
  }
}
