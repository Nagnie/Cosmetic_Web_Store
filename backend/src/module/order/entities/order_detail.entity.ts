import { PrimaryGeneratedColumn, Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "@/module/product/entities/product.entity";

@Entity({ name: "order_detail" })
export class OrderDetail {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.orderDetails)
    @JoinColumn({ name: "order_id" })
    order: Order;

    // @Column({ name: "product_id" })
    // productId: number;
    @ManyToOne(() => Product, product => product.order_details)
    @JoinColumn({name: "pro_id"})
    product: Product;

    @Column({ name: "class_id" })
    class_id: number;

    @Column({ name: "quantity" })
    quantity: number;

    @Column({ name: "price" })
    price: number;
}