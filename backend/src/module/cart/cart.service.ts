import { Injectable, Req } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { DeleteCartDto } from './dto/delete-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly dataSource: DataSource
  ) { }

  async create(createCartDto: CreateCartDto, @Req() req: Request & { session: any }) {
    const { id_pro, id_class, quantity } = createCartDto;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingProduct = req.session.cart.find(
      (item) => item.id_pro === id_pro && item.id_class === id_class
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      req.session.cart.push({ id_pro, id_class, quantity });
    }

    return { message: 'Product added to cart', cart: req.session.cart };
  }

  async findAll(@Req() req: Request & { session: any }, page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    if (!req.session.cart || req.session.cart.length === 0) {
      return {
        message: "Empty cart",
        data: []
      }
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
    const cartItemsJson = JSON.stringify(req.session.cart);
    console.log('JSON: ', cartItemsJson);
    const total_items = req.session.cart.length;
    const total_pages = Math.ceil(total_items / limit);

    const data = await this.dataSource.query(`
        WITH cart_items AS (
            SELECT * FROM jsonb_to_recordset($1::jsonb) 
            AS x(id_pro INT, id_class INT, quantity INT)
        )
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name, class.id_class AS id_class, class.name AS class_name, (ci.quantity * pro.price) AS pro_price, ci.quantity AS quantity,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images
        FROM cart_items AS ci
        JOIN product AS pro ON pro.id_pro = ci.id_pro
        JOIN classification AS class ON class.id_class = ci.id_class
        LIMIT $2 OFFSET $3
      `, [cartItemsJson, limit, offset])

    let total_prices = 0;
    for (const item of data) {
      total_prices += item.pro_price * item.quantity;
    }

    return {
      message: "Products in cart",
      page: page,
      limit: limit,
      total_pages: total_pages,
      total_items: total_items,
      total_prices: total_prices,
      data: data
    }
  }

  async update(@Req() req: Request & { session: any }, updateCartDto: UpdateCartDto) {
    const { id_pro, old_id_class, id_class, quantity } = updateCartDto;

    // If user change classification
    if (id_class !== old_id_class) {
      req.session.cart = req.session.cart.filter(item => !(item.id_pro === id_pro && item.id_class === old_id_class));
      const index = req.session.cart.findIndex(item => item.id_pro === id_pro && item.id_class === id_class);

      if (index !== -1) {
        req.session.cart[index].quantity = quantity;
      } else {
        req.session.cart.push({ id_pro, id_class, quantity });
      }
    } else {
      const index = req.session.cart.findIndex(item => item.id_pro === id_pro && item.id_class === id_class);
      if (index !== -1) {
        req.session.cart[index].quantity = quantity;
      }
    }

    const updatedItem = await this.dataSource.query(`
        SELECT pro.id_pro AS id_pro, pro.name AS pro_name, class.id_class AS id_class, class.name AS class_name, ($1 * pro.price) AS pro_price, $1 AS quantity,
        COALESCE((
          SELECT json_agg(img.link)
          FROM product_image AS img
          WHERE img.id_pro = pro.id_pro), '[]'::json
        ) AS images
        FROM product AS pro
        JOIN classification AS class ON class.id_class = $2
        WHERE pro.id_pro = $3
      `, [quantity, id_class, id_pro])

    return {
      message: "Update product successfully",
      updatedItem
    }
  }

  async remove(@Req() req: Request & { session: any }, deleteCartDto: DeleteCartDto) {
    const { id_pro, id_class } = deleteCartDto;
    req.session.cart = req.session.cart.filter(
      item => !(item.id_pro === id_pro && item.id_class === id_class)
    );

    return { message: 'Item removed from cart' };
  }
}
