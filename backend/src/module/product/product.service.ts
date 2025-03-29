import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { DataSource, Repository } from "typeorm";
import { query, Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { ResponseDto } from "@/helpers/utils";
import { queryObjects } from "v8";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly dataSource: DataSource
    ) { }

    async create(createProductDto: CreateProductDto) {
        const { pro_name, price, origin_price, id_subcat, id_bra, status, img_url, classification, desc } =
            createProductDto;

        const queryRunner = this.dataSource.createQueryRunner();

        // START TRANSACTION
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // INSERT PRODUCT
            const insertProduct = await queryRunner.query(
                `
        INSERT INTO product(name, price, origin_price, description, status, id_subcat, id_bra)
        VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
                [pro_name, price, origin_price, desc, status, id_subcat, id_bra]
            );

            const id_pro = insertProduct[0]?.id_pro;

            // INSERT IMAGES
            if (img_url && img_url.length > 0) {
                for (const url of img_url) {
                    await queryRunner.query(
                        `
              INSERT INTO product_image(id_pro, link)
              VALUES($1, $2)
            `,
                        [id_pro, url]
                    );
                }
            }

            // INSERT CLASSIFICATION
            if (classification && classification.length > 0) {
                for (const classi of classification) {
                    await queryRunner.query(
                        `
              INSERT INTO classification(id_pro, name)
              VALUES($1, $2)
            `,
                        [id_pro, classi]
                    );
                }
            }

            // COMMIT
            await queryRunner.commitTransaction();
            return {
                statusCode: 201,
                message: `Product "${id_pro}" created and added image successfully`,
                data: id_pro,
            };
        } catch (error) {
            // ROLL BACK
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException("Failed to create product");
        } finally {
            // CLOSE QUERYRUNNER
            await queryRunner.release();
        }
    }

    async findAll(page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const data = await this.dataSource.query(
            `
      SELECT pro.id_pro AS id_pro, pro.name AS pro_name, cat.id_cat AS cat_id, cat.name AS cat_name, scat.id_subcat AS id_subcat, scat.name AS scat_name, bra.id_bra AS id_bra, bra.name AS bra_name,
      (pro.price::NUMERIC)::FLOAT AS price, (pro.origin_price::NUMERIC)::FLOAT AS origin_price, pro.status AS status, $3 AS type,
      COALESCE((
        SELECT json_agg(img.link)
        FROM product_image AS img
        WHERE img.id_pro = pro.id_pro), '[]'::json
      ) AS images,
      COALESCE(
        (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name)) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
      ) AS classification
      FROM product AS pro
      JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
      JOIN category AS cat ON scat.id_cat = cat.id_cat
      JOIN brand AS bra ON pro.id_bra = bra.id_bra
      ORDER BY pro.id_pro ASC
      LIMIT $1 OFFSET $2
    `,
            [limit, offset, "product"]
        );

        const totalQuery = await this.dataSource.query(`
        SELECT COUNT(pro.id_pro) AS total_items
        FROM product AS pro
      `);

        const total_items = Number(totalQuery[0]?.total_items || 0);
        // console.log('TOTAL ITEMS: ', total_items);

        const total_pages = Math.ceil(total_items / limit);

        return {
            message: "All products",
            page: page,
            limit: limit,
            total_pages: total_pages,
            total_items: total_items,
            data: data,
        };
    }

    async findOne(id_pro: number) {
        const productInfo = await this.dataSource.query(
            `
      SELECT pro.id_pro AS id_pro, pro.name AS pro_name,  (pro.price::NUMERIC)::FLOAT AS price, (pro.origin_price::NUMERIC)::FLOAT AS origin_price, pro.description, cat.name AS cat_name, scat.id_subcat AS id_subcat, scat.name AS scat_name, bra.id_bra AS id_bra, bra.name AS bra_name, pro.status AS pro_status, $2 AS type,
      COALESCE((
        SELECT json_agg(img.link)
        FROM product_image AS img
        WHERE img.id_pro = pro.id_pro), '[]'::json
      ) AS images,
      COALESCE(
        (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name)) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
      ) AS classification
      FROM product AS pro
      JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
      JOIN category AS cat ON scat.id_cat = cat.id_cat
      JOIN brand AS bra ON pro.id_bra = bra.id_bra
      WHERE pro.id_pro = $1
    `,
            [id_pro, "product"]
        );

        const res = productInfo.map(item => ({
            ...item,
            price: +item.price
        }));

        return res;
    }

    async getProductsByBrand(req: Request) {
        try {
            const { brand, page = 1, limit = 5 } = req.query;
            const brandName = (brand as string).toLowerCase().trim();
            const allItems = await this.dataSource.query(
                `
        SELECT p.*
        FROM product p 
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE LOWER(b.name) LIKE CONCAT('%', $1::TEXT, '%')
      `,
                [brandName]
            );
            const allPage = Math.ceil(allItems.length / (limit as number));
            const products = await this.dataSource.query(
                `
        SELECT p.*, $4 AS type,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = p.id_pro), '[]'::json
        ) AS images,
        COALESCE(
          (SELECT json_agg(DISTINCT class.name) 
          FROM classification AS class 
          WHERE class.id_pro = p.id_pro), '[]'::json
        ) AS classification
        FROM product p
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE LOWER(b.name) LIKE CONCAT('%', $1::TEXT, '%')
        LIMIT $2 OFFSET $3
      `,
                [brandName, limit, ((page as number) - 1) * (limit as number), "product"]
            );
            return new ResponseDto(HttpStatus.OK, "Successfully", {
                total_pages: allPage,
                total_items: allItems.length,
                page,
                limit,
                products,
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductsByCategory(req: Request) {
        try {
            const { category, subcate, page = 1, limit = 5 } = req.query;

            const cateName = category ? (category as string).toLowerCase().trim() : null;
            const subCateName = subcate ? (subcate as string).toLowerCase().trim() : null;

            const allItems = await this.dataSource.query(
                `
        SELECT p.*
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        WHERE ($1::TEXT IS NULL OR LOWER(c.name) LIKE CONCAT('%', $1::TEXT, '%')) AND ($2::TEXT IS NULL OR LOWER(sc.name) LIKE CONCAT('%', $2::TEXT, '%'))
      `,
                [cateName, subCateName]
            );
            const allPage = Math.ceil(allItems.length / (limit as number));
            const products = await this.dataSource.query(
                `
        SELECT p.*, $5 AS type,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = p.id_pro), '[]'::json
        ) AS images,
        COALESCE(
          (SELECT json_agg(DISTINCT class.name) 
          FROM classification AS class 
          WHERE class.id_pro = p.id_pro), '[]'::json
        ) AS classification
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        WHERE ($1::TEXT IS NULL OR LOWER(c.name) LIKE CONCAT('%', $1::TEXT, '%')) AND ($2::TEXT IS NULL OR LOWER(sc.name) LIKE CONCAT('%', $2::TEXT, '%'))
        LIMIT $3 OFFSET $4
      `,
                [cateName, subCateName, limit, ((page as number) - 1) * (limit as number), "product"]
            );
            return new ResponseDto(HttpStatus.OK, "Successfully", {
                total_pages: allPage,
                total_items: allItems.length,
                page,
                limit,
                products,
            });
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getProductBySubcategory(scat_name: string, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const data = await this.dataSource.query(
            `
            SELECT pro.id_pro AS id_pro, pro.name AS pro_name, (pro.price::NUMERIC)::FLOAT AS price, (pro.origin_price::NUMERIC)::FLOAT AS origin_price, bra.name AS bra_name, $4 AS type,
            COALESCE((
            SELECT json_agg(img.link)
            FROM product_image AS img
            WHERE img.id_pro = pro.id_pro), '[]'::json
            ) AS images
            FROM product AS pro
            JOIN brand AS bra ON pro.id_bra = bra.id_bra
            JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
            WHERE scat.name = $1
            LIMIT $2 OFFSET $3
        `,
            [scat_name, limit, offset, "product"]
        );

        const totalQuery = await this.dataSource.query(
            `
            SELECT COUNT(pro.id_pro) AS total_items
            FROM product AS pro
            JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat 
            WHERE scat.name = $1
        `,
            [scat_name]
        );
        const total_items = Number(totalQuery[0]?.total_items || 0);
        // console.log('TOTAL ITEMS: ', total_items);
        const total_pages = Math.ceil(total_items / limit);

        return {
            message: "All same brand products",
            page: page,
            limit: limit,
            total_pages: total_pages,
            total_items: total_items,
            data: data,
        }
    }

    async searchAndFilter(req: Request) {
        try {
            const {
                key,
                category = null,
                subcate = null,
                brand = null,
                minPrice = 0,
                maxPrice = 9999999,
                sortBy = "id_pro",
                orderBy = "ASC",
                page = 1,
                limit = 5,
            } = req.query;

            const keyword = (key as unknown as string)?.toLowerCase();
            const cateName = category ? (category as string).toLowerCase().trim() : null;
            const subCateName = subcate ? (subcate as string).toLowerCase().trim() : null;
            const brandName = brand ? (brand as string).toLowerCase().trim() : null;

            const allItems = await this.dataSource.query(
                `
        SELECT p.*
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE
          ($1::TEXT IS NULL OR LOWER(p.name) LIKE CONCAT('%', $1::TEXT, '%')) AND
          ($2::TEXT IS NULL OR LOWER(c.name) LIKE CONCAT('%', $2::TEXT, '%')) AND
          ($3::TEXT IS NULL OR LOWER(sc.name) LIKE CONCAT('%', $3::TEXT, '%')) AND
          ($4::TEXT IS NULL OR LOWER(b.name) LIKE CONCAT('%', $4::TEXT, '%')) AND
          (p.price >= $5 AND p.price <= $6)
      `,
                [keyword, cateName, subCateName, brandName, minPrice, maxPrice]
            );

            const validSortBy = `p.${sortBy}`;
            const totalItems = allItems.length;
            const totalPages = Math.ceil(totalItems / (limit as number));

            const products = await this.dataSource.query(
                `
        SELECT p.*, $9 AS type,
          COALESCE((
            SELECT json_agg(img.link)
            FROM product_image AS img
            WHERE img.id_pro = p.id_pro), '[]'::json
          ) AS images,
          COALESCE((
            SELECT json_agg(DISTINCT class.name)
            FROM classification AS class
            WHERE class.id_pro = p.id_pro), '[]'::json
          ) AS classification
        FROM product p
        JOIN sub_category sc ON p.id_subcat = sc.id_subcat
        JOIN category c ON sc.id_cat = c.id_cat
        JOIN brand b ON p.id_bra = b.id_bra
        WHERE
          ($1::TEXT IS NULL OR LOWER(p.name) LIKE CONCAT('%', $1::TEXT, '%')) AND
          ($2::TEXT IS NULL OR LOWER(c.name) LIKE CONCAT('%', $2::TEXT, '%')) AND
          ($3::TEXT IS NULL OR LOWER(sc.name) LIKE CONCAT('%', $3::TEXT, '%')) AND
          ($4::TEXT IS NULL OR LOWER(b.name) LIKE CONCAT('%', $4::TEXT, '%')) AND
          (p.price >= $5 AND p.price <= $6)
        ORDER BY ${validSortBy} ${orderBy}
        LIMIT $7 OFFSET $8
      `,
                [
                    keyword,
                    cateName,
                    subCateName,
                    brandName,
                    minPrice,
                    maxPrice,
                    limit,
                    ((page as number) - 1) * (limit as number),
                    "product"
                ]
            );

            return new ResponseDto(HttpStatus.OK, "Successfully", {
                total_pages: totalPages,
                total_items: totalItems,
                page,
                limit,
                products,
            });
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Failed to search and filter products");
        }
    }

    async findSameBrand(id_pro: number, bra_name: string, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const data = await this.dataSource.query(
            `
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name,  (pro.price::NUMERIC)::FLOAT AS price, (pro.origin_price::NUMERIC)::FLOAT AS origin_price, bra.name AS bra_name, $5 AS type,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images,
        COALESCE(
         (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name)) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
        ) AS classification
        FROM product AS pro
        JOIN brand AS bra ON pro.id_bra = bra.id_bra
        WHERE bra.name = $1 AND pro.id_pro != $2
        LIMIT $3 OFFSET $4
      `,
            [bra_name, id_pro, limit, offset, "product"]
        );

        const totalQuery = await this.dataSource.query(
            `
        SELECT COUNT(pro.id_pro) AS total_items
        FROM product AS pro
        JOIN brand AS bra ON pro.id_bra = bra.id_bra 
        WHERE bra.name = $1 AND pro.id_pro != $2
      `,
            [bra_name, id_pro]
        );
        const total_items = Number(totalQuery[0]?.total_items || 0);
        // console.log('TOTAL ITEMS: ', total_items);
        const total_pages = Math.ceil(total_items / limit);

        return {
            message: "All same brand products",
            page: page,
            limit: limit,
            total_pages: total_pages,
            total_items: total_items,
            data: data,
        };
    }

    async findSameSubcategory(id_pro: number, scat_name: string, page: number, limit: number) {
        const offset = (page - 1) * limit;

        const data = await this.dataSource.query(
            `
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name,  (pro.price::NUMERIC)::FLOAT AS price, (pro.origin_price::NUMERIC)::FLOAT AS origin_price, bra.name AS bra_name, $5 AS type,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images,
        COALESCE(
         (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name)) 
         FROM classification AS class 
         WHERE class.id_pro = pro.id_pro), '[]'::json
        ) AS classification
        FROM product AS pro
        JOIN sub_category AS scat ON pro.id_subcat = scat.id_subcat
        JOIN brand AS bra ON pro.id_bra = bra.id_bra
        WHERE scat.name = $1 AND pro.id_pro != $2
        LIMIT $3 OFFSET $4
      `,
            [scat_name, id_pro, limit, offset, "product"]
        );

        const totalQuery = await this.dataSource.query(
            `
      SELECT COUNT(pro.id_pro) AS total_items
      FROM product AS pro
      JOIN sub_category AS scat ON scat.id_subcat = pro.id_subcat 
      WHERE scat.name = $1 AND pro.id_pro != $2
    `,
            [scat_name, id_pro]
        );

        const total_items = Number(totalQuery[0]?.total_items || 0);
        // console.log('TOTAL ITEMS: ', total_items);
        const total_pages = Math.ceil(total_items / limit);

        return {
            message: "All same subcategory products",
            page: page,
            limit: limit,
            total_pages: total_pages,
            total_items: total_items,
            data: data,
        };
    }

    async update(id_pro: number, updateProductDto: UpdateProductDto) {
        const { pro_name, price, origin_price, id_subcat, id_bra, status, images, classification, description } =
            updateProductDto;

        // START TRANSACTION
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Update product table
            await queryRunner.query(
                `
          UPDATE product 
          SET name = $1, price = $2, id_subcat = $3, id_bra = $4, status = $5, description = $6, origin_price = $8
          WHERE id_pro = $7;
      `,
                [pro_name, price, id_subcat, id_bra, status, description, id_pro, origin_price]
            );

            // If having new image list
            if (images && images.length > 0) {
                // Xóa ảnh cũ
                await queryRunner.query(
                    `
              DELETE FROM product_image WHERE id_pro = $1;
          `,
                    [id_pro]
                );

                // Thêm ảnh mới
                for (const img of images) {
                    await queryRunner.query(
                        `
                  INSERT INTO product_image (id_pro, link) VALUES ($1, $2);
              `,
                        [id_pro, img]
                    );
                }
            }

            // If having new classification list
            if (classification && classification.length > 0) {
                // Xóa ảnh cũ
                await queryRunner.query(
                    `
              DELETE FROM classification WHERE id_pro = $1;
          `,
                    [id_pro]
                );

                // Thêm ảnh mới
                for (const classi of classification) {
                    await queryRunner.query(
                        `
                  INSERT INTO classification (id_pro, name) VALUES ($1, $2);
              `,
                        [id_pro, classi]
                    );
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
        const data = await this.dataSource.query(
            `
      DELETE FROM product WHERE id_pro = $1
      RETURNING *;
    `,
            [id_pro]
        );

        return data[0];
    }
}
