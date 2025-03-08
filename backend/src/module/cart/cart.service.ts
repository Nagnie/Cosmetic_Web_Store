import { Injectable, Req } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Request } from 'express';

@Injectable()
export class CartService {
  async create(createCartDto: CreateCartDto, @Req() req: Request & { session: any }) {
    const { id_pro, id_class, quantity } = createCartDto;
    
    if(!req.session.cart){
      req.session.cart = [];
    }

    const existingProduct = req.session.cart.find(
      (item) => item.id_pro === id_pro && item.id_class === id_class
    );

    if(existingProduct){
      existingProduct.quantity += quantity;
    } else{
      req.session.cart.push({ id_pro, id_class, quantity });
    }
    
    return { message: 'Product added to cart', cart: req.session.cart };
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
