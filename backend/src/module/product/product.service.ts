import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource } from 'typeorm';
import { query } from 'express';
import { queryObjects } from 'v8';

@Injectable()
export class ProductService {
  constructor(private readonly dataSource: DataSource) { }

  async create(createProductDto: CreateProductDto) {
    const { pro_name, price, id_subcat, id_bra, status, img_url, classification, desc } = createProductDto;

    const queryRunner = this.dataSource.createQueryRunner();

    // START TRANSACTION
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT PRODUCT
      const insertProduct = await queryRunner.query(`
        INSERT INTO product(name, price, description, status, id_subcat, id_bra)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `, [pro_name, price, desc, status, id_subcat, id_bra])

      const id_pro = insertProduct[0]?.id_pro;

      // INSERT IMAGES
      if (img_url && img_url.length > 0) {
        for (const url of img_url) {
          await queryRunner.query(`
              INSERT INTO product_image(id_pro, link)
              VALUES($1, $2)
            `, [id_pro, url])
        }
      }

      // INSERT CLASSIFICATION
      if (classification && classification.length > 0) {
        for (const classi of classification) {
          await queryRunner.query(`
              INSERT INTO classification(id_pro, name)
              VALUES($1, $2)
            `, [id_pro, classi])
        }
      }

      // COMMIT
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        message: `Product "${id_pro}" created and added image successfully`,
        data: id_pro
      }
    } catch (error) {
      // ROLL BACK
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to create product');
    } finally {
      // CLOSE QUERYRUNNER
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    return await this.dataSource.query(`
      SELECT pro.id_pro AS id_pro, pro.name AS pro_name, cat.name AS cat_name, scat.name AS scat_name, bra.name AS bra_name,
      pro.price AS price,
      COALESCE((
        SELECT json_agg(img.link)
        FROM product_image AS img
        WHERE img.id_pro = pro.id_pro), '[]'::json
      ) AS images,
      COALESCE(
        (SELECT json_agg(DISTINCT class.name) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
      ) AS classification
      FROM product AS pro
      JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
      JOIN category AS cat ON scat.id_cat = cat.id_cat
      JOIN brand AS bra ON pro.id_bra = bra.id_bra
      LIMIT $1 OFFSET $2
    `, [limit, offset])
  }

  async findOne(id_pro: number) {
    const productInfo = this.dataSource.query(`
      SELECT pro.id_pro AS id_pro, pro.name AS pro_name, pro.price, pro.description, cat.name AS cat_name, scat.name AS scat_name, bra.name AS bra_name, 
      COALESCE((
        SELECT json_agg(img.link)
        FROM product_image AS img
        WHERE img.id_pro = pro.id_pro), '[]'::json
      ) AS images,
      COALESCE(
        (SELECT json_agg(DISTINCT class.name) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
      ) AS classification
      FROM product AS pro
      JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
      JOIN category AS cat ON scat.id_cat = cat.id_cat
      JOIN brand AS bra ON pro.id_bra = bra.id_bra
      WHERE pro.id_pro = $1
    `, [id_pro]);

    return productInfo;
  }

  async findSameBrand(bra_name: string, page: number, limit: number){
    const offset = (page - 1) * limit;

    return await this.dataSource.query(`
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name, pro.price AS pro_price,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images
        FROM product AS pro
        JOIN brand AS bra ON pro.id_bra = bra.id_bra
        WHERE bra.name = $1
        LIMIT $2 OFFSET $3
      `, [bra_name, limit, offset])
  }

  async findSameSubcategory(scat_name: string, page: number, limit: number){
    const offset = (page - 1) * limit;

    return await this.dataSource.query(`
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name, pro.price AS pro_price,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images
        FROM product AS pro
        JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
        WHERE scat.name = $1
        LIMIT $2 OFFSET $3
      `, [scat_name, limit, offset])
  }

  async update(id_pro: number, updateProductDto: UpdateProductDto) {
    const { pro_name, price, id_subcat, id_bra, status, img_url, desc } = updateProductDto;

    // START TRANSACTION 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update product table
      await queryRunner.query(`
          UPDATE product 
          SET name = $1, price = $2, id_subcat = $3, id_bra = $4, status = $5, description = $6
          WHERE id_pro = $7;
      `, [pro_name, price, id_subcat, id_bra, status, desc, id_pro]);

      // If having new image list 
      if (img_url && img_url.length > 0) {
        // Xóa ảnh cũ
        await queryRunner.query(`
              DELETE FROM product_image WHERE id_pro = $1;
          `, [id_pro]);

        // Thêm ảnh mới
        for (const img of img_url) {
          await queryRunner.query(`
                  INSERT INTO product_image (id_pro, link) VALUES ($1, $2);
              `, [id_pro, img]);
        }
      }

      // COMMIT
      await queryRunner.commitTransaction();
      return { message: "Product updated successfully", id_pro };

    } catch (error) {
      // ROLL BACK
      await queryRunner.rollbackTransaction();
      throw new Error(`Update failed: ${error.message}`);
    } finally {
      // CLOSE 
      await queryRunner.release();
    }
  }

  async remove(id_pro: number) {
    const data = await this.dataSource.query(`
      DELETE FROM product WHERE id_pro = $1
      RETURNING *;
    `, [id_pro])

    return data[0];
  }
}
