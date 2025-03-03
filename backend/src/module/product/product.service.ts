import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { query, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ResponseDto } from '@/helpers/utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {
    const { pro_name, price, id_subcat, id_bra, stock, status, img_url, desc } = createProductDto;

    const queryRunner = this.dataSource.createQueryRunner();

    // START TRANSACTION
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // INSERT PRODUCT
      const insertProduct = await queryRunner.query(`
        INSERT INTO product(name, price, description, status, id_subcat, id_bra, stock)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING id_pro
        `, [pro_name, price, desc, status, id_subcat, id_bra, stock])

      const id_pro = insertProduct[0].id_pro;

      // INSERT IMAGES
      if (img_url && img_url.length > 0) {
        for (const url of img_url) {
          await queryRunner.query(`
              INSERT INTO product_image(id_pro, link)
              VALUES($1, $2)
            `, [id_pro, url])
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
      SELECT pr.name AS pr_name, cat.name AS cat_name, bra.name AS bra_name,
      pr.price AS price, pr.stock AS stock
      FROM product AS pr
      JOIN sub_category AS scat ON pr.id_subcat = scat.id_subcat
      JOIN category AS cat ON scat.id_cat = cat.id_cat
      JOIN brand AS bra ON pr.id_bra = bra.id_bra
      LIMIT $1 OFFSET $2
    `, [limit, offset])
  }

  async findOne(id_pro: number) {
    const productInfo = this.dataSource.query(`
      SELECT pro.id_pro, pro.name AS pro_name, pro.price, pro.description, 
      scat.name AS scat_name, bra.name AS bra_name, 
      COALESCE(json_agg(img.link) FILTER (WHERE img.link IS NOT NULL), '[]') AS images
      FROM product AS pro
      JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
      JOIN brand AS bra ON pro.id_bra = bra.id_bra
      LEFT JOIN product_image AS img ON pro.id_pro = img.id_pro
      WHERE pro.id_pro = $1
      GROUP BY pro.id_pro, scat.name, bra.name;
    `, [id_pro]);

    return productInfo;
  }

  async getProductsByBrand(req: Request) {
    try {
      const {
        brand,
        page = 1,
        limit = 5,
      } = req.query;
      const brandName = (brand as string).toLowerCase();
      const allItems = await this.dataSource.query(`
        SELECT p.*
        FROM product p
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE LOWER(b.name) = $1
      `, [brandName]);
      const allPage = Math.ceil(allItems.length / (limit as number)); 
      const products = await this.dataSource.query(`
        SELECT p.*
        FROM product p
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE LOWER(b.name) = $1
        LIMIT $2 OFFSET $3
      `, [brandName, limit, (page as number - 1) * (limit as number)]);
      return new ResponseDto(HttpStatus.OK, "Successfully", {allPage, products});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductsByCategory(req: Request) {
    try {
      const {
        category,
        subCate,
        page = 1,
        limit = 5,
      } = req.query;

      const cateName = category ? (category as string).toLowerCase() : null;
      const subCateName = subCate ? (subCate as string).toLowerCase() : null;

      const allItems = await this.dataSource.query(`
        SELECT p.*
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        WHERE ($1::TEXT IS NULL OR LOWER(c.name) =  $1) AND ($2::TEXT IS NULL OR LOWER(sc.name) = $2)
      `, [cateName, subCateName]);
      const allPage = Math.ceil(allItems.length / (limit as number)); 
      const products = await this.dataSource.query(`
        SELECT p.*
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        WHERE ($1::TEXT IS NULL OR LOWER(c.name) =  $1) AND ($2::TEXT IS NULL OR LOWER(sc.name) = $2)
        LIMIT $3 OFFSET $4
      `, [cateName, subCateName, limit, (page as number - 1) * (limit as number)]);
      return new ResponseDto(HttpStatus.OK, "Successfully", {allPage, products});
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id_pro: number, updateProductDto: UpdateProductDto) {
    const { pro_name, price, id_subcat, id_bra, stock, status, img_url, desc } = updateProductDto;

    // START TRANSACTION 
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update product table
      await queryRunner.query(`
          UPDATE product 
          SET name = $1, price = $2, id_subcat = $3, id_bra = $4, stock = $5, status = $6, description = $7
          WHERE id_pro = $8;
      `, [pro_name, price, id_subcat, id_bra, stock, status, desc, id_pro]);

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
      await queryRunner.release();
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
