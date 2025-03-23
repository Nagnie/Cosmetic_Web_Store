import { Injectable, Req } from "@nestjs/common";
import { CreateCartDto } from "./dto/create-cart.dto";
import { UpdateCartDto } from "./dto/update-cart.dto";
import { Request } from "express";
import { DataSource } from "typeorm";
import { DeleteCartDto } from "./dto/delete-cart.dto";

@Injectable()
export class CartService {
  constructor(private readonly dataSource: DataSource) { }

  async create(
    createCartDto: CreateCartDto,
    @Req() req: Request & { session: any }
  ) {
    const { id_pro, id_class, quantity, type } = createCartDto;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    let existingProduct;
    if (type === "product") {
      existingProduct = req.session.cart.find(
        (item) =>
          item.id_pro === id_pro &&
          item.id_class === id_class &&
          item.type === type
      );
    } else if (type === "combo") {
      existingProduct = req.session.cart.find(
        (item) => item.id_pro === id_pro && item.type === type
      );
    }

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      req.session.cart.push({ id_pro, id_class, quantity, type });
    }

    return {
      message: "Product or combo added to cart",
      cart: req.session.cart,
    };
  }

  async findAll(
    @Req() req: Request & { session: any },
    page: number = 1,
    limit: number = 10
  ) {
    const offset = (page - 1) * limit;

    if (!req.session.cart || req.session.cart.length === 0) {
      return {
        message: "Empty cart",
        data: [],
      };
    }

    // Way 01:
    // const cartItems = req.session.cart;
    // console.log('CART ITEM: ', cartItems);
    // const data = [];
    // for (const item of cartItems) {
    //   const detailItem = await this.dataSource.query(`
    //       SELECT pro.id_pro, pro.name AS pro_name, class.id_class, class.name AS class_name, pro.price AS pro_price,
    //       $1 AS quantity
    //       FROM product AS pro
    //       JOIN classification AS class ON class.id_class = $2
    //       WHERE pro.id_pro = $3
    //     `, [item.quantity, item.id_class, item.id_pro])
    //   console.log('DETAIL: ', detailItem);
    //   data.push(...detailItem);
    // }
    // return {
    //   message: "Products in cart",
    //   data: data
    // }

    // Way 02:
    // Seperate product and combo
    // const cartItems = req.session.cart || [];
    // const products = cartItems.filter(item => item.type === 'product');
    // const combos = cartItems.filter(item => item.type === 'combo');

    // Convert to JSON
    // const productsJson = JSON.stringify(products);
    // console.log('PRODUCT JSON: ', productsJson);
    // const combosJson = JSON.stringify(combos);
    // console.log('COMBO JSON: ', combosJson);

    // const total_items = req.session.cart.length;
    // const total_pages = Math.ceil(total_items / limit);

    // const data = await this.dataSource.query(`
    //     WITH cart_items AS (
    //         SELECT * FROM jsonb_to_recordset($1::jsonb)
    //         AS x(id_pro INT, id_class INT, quantity INT)
    //     )
    //     SELECT pro.id_pro AS id_pro, pro.name AS pro_name, class.id_class AS id_class, class.name AS class_name, pro.price AS pro_price, ci.quantity AS quantity,
    //     COALESCE((
    //       SELECT json_agg(img.link)
    //       FROM product_image AS img
    //       WHERE img.id_pro = pro.id_pro), '[]'::json
    //     ) AS images,
    //     COALESCE(
    //       (SELECT json_agg(DISTINCT jsonb_build_object('id_class', class.id_class, 'name', class.name))
    //       FROM classification AS class
    //       WHERE class.id_pro = pro.id_pro), '[]'::json
    //     ) AS classification
    //     FROM cart_items AS ci
    //     JOIN product AS pro ON pro.id_pro = ci.id_pro
    //     LEFT JOIN classification AS class ON class.id_class = ci.id_class
    //     LIMIT $2 OFFSET $3
    //   `, [productsJson, limit, offset])

    // const data_combo = await this.dataSource.query(`
    //     WITH cart_items AS (
    //         SELECT * FROM jsonb_to_recordset($1::jsonb)
    //         AS x(id_pro INT, id_class INT, quantity INT)
    //     )
    //     SELECT com.id_combo AS id_combo, com.name AS com_name, com.price AS com_price, ci.quantity AS quantity,
    //     COALESCE((
    //       SELECT json_agg(img.link)
    //       FROM combo_image AS img
    //       WHERE img.id_combo = com.id_combo), '[]'::json
    //     ) AS images
    //     FROM cart_items AS ci
    //     JOIN combo AS com ON com.id_combo = ci.id_pro
    //     LIMIT $2 OFFSET $3
    //   `, [productsJson, limit, offset])

    // Way03:
    const cartJson = JSON.stringify(req.session.cart);

    const total_items = req.session.cart.length;
    const total_pages = Math.ceil(total_items / limit);
    const data = await this.dataSource.query(
      `
      WITH cart_items AS (
          SELECT * FROM jsonb_to_recordset($1::jsonb) 
          AS x(id_pro INT, id_class INT, quantity INT, type TEXT)
      )
      SELECT 
          pro.id_pro AS id, 
          pro.name AS name, 
          class.id_class AS id_class, 
          class.name AS class_name, 
          pro.price AS price, 
          ci.quantity AS quantity,
          'product' AS type,
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
      FROM cart_items AS ci
      JOIN product AS pro ON pro.id_pro = ci.id_pro
      LEFT JOIN classification AS class ON class.id_class = ci.id_class
      WHERE ci.type = 'product'
      
      UNION ALL
      
      SELECT 
          com.id_combo AS id, 
          com.name AS name, 
          NULL AS id_class, 
          NULL AS class_name, 
          com.price AS price, 
          ci.quantity AS quantity,
          'combo' AS type,
          COALESCE((
              SELECT json_agg(img.link)
              FROM combo_image AS img
              WHERE img.id_combo = com.id_combo), '[]'::json
          ) AS images,
          NULL AS classification
      FROM cart_items AS ci
      JOIN combo AS com ON com.id_combo = ci.id_pro
      WHERE ci.type = 'combo'
  
      ORDER BY name ASC
      LIMIT $2 OFFSET $3
  `,
      [cartJson, limit, offset]
    );

    let total_prices = 0;
    for (const item of data) {
      total_prices += item.price * item.quantity;
    }

    if (!req.session.total) {
      req.session.total = {}; 
    }

    req.session.total.total_prices = total_prices; 
    console.log(req.session.total);

    return {
      message: "Products in cart",
      page: page,
      limit: limit,
      total_pages: total_pages,
      total_items: total_items,
      total_prices: total_prices,
      data: data,
    };
  }

  async update(
    @Req() req: Request & { session: any },
    updateCartDto: UpdateCartDto
  ) {
    const { id_pro, old_id_class, id_class, quantity, type } = updateCartDto;

    let updatedItem;
    if (type === "product") {
      // If user change classification
      if (id_class !== old_id_class) {
        req.session.cart = req.session.cart.filter(
          (item) =>
            !(item.id_pro === id_pro && item.id_class === old_id_class) &&
            item.type === type
        );
        const index = req.session.cart.findIndex(
          (item) =>
            item.id_pro === id_pro &&
            item.id_class === id_class &&
            item.type === type
        );

        if (index !== -1) {
          req.session.cart[index].quantity = quantity;
        } else {
          req.session.cart.push({ id_pro, id_class, quantity, type });
        }
      } else {
        const index = req.session.cart.findIndex(
          (item) =>
            item.id_pro === id_pro &&
            item.id_class === id_class &&
            item.type === type
        );
        if (index !== -1) {
          req.session.cart[index].quantity = quantity;
        }
      }

      updatedItem = await this.dataSource.query(
        `
        SELECT pro.id_pro AS id, pro.name AS name, class.id_class AS id_class, class.name AS class_name, pro.price AS price, $1 AS quantity,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images
        FROM product AS pro
        LEFT JOIN classification AS class ON class.id_class = $2
        WHERE pro.id_pro = $3
      `,
        [quantity, id_class, id_pro]
      );
    } else if (type === "combo") {
      const index = req.session.cart.findIndex(
        (item) => item.id_pro === id_pro && item.type === type
      );
      if (index !== -1) {
        req.session.cart[index].quantity = quantity;
      }

      updatedItem = await this.dataSource.query(
        `
        SELECT com.id_combo AS id, com.name AS name, NULL AS id_class, NULL AS class_name, com.price AS price, $1 AS quantity,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images,
        NULL AS classification
        FROM combo AS com
        WHERE com.id_combo = $2
      `,
        [quantity, id_pro]
      );
    }

    return {
      message: "Update product successfully",
      updatedItem,
    };
  }

  async remove(
    @Req() req: Request & { session: any },
    deleteCartDto: DeleteCartDto
  ) {
    const { id_pro, id_class, type } = deleteCartDto;
    req.session.cart = req.session.cart.filter(
      (item) => !(item.id_pro === id_pro && item.id_class === id_class && item.type === type)
    );

    return { message: "Item removed from cart" };
  }
}
