import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order_status.enum";
import { OrderDetail } from "./order_detail.entity";
import * as moment from "moment";

@Entity({name: "orders"})
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "email"})
    email: string;

    @Column()
    checked: boolean;

    @Column({name: "customer"})
    customer: string;

    @Column({name: "phone"})
    phone: string;

    @Column({name: "address"})
    address: string;

    @Column({name: "status"})
    status: OrderStatus;
    
    @Column({name: "sum_price", default: 0})
    sumPrice: number;
    
    @Column({name: "note"})
    note: string;

    @Column({name: "created_at", default: new Date()})
    created_at: Date;

    @OneToMany(() => OrderDetail, orderDetail => orderDetail.order)
    orderDetails: OrderDetail[];
}
