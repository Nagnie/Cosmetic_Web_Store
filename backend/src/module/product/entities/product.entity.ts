import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn({name: "id_pro"})
    id: number;

    @Column({name: "name"})
    name: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column()
    id_subcat: number;

    @Column({name: "id_bra"})
    id_bra: number;

    @Column()
    stock: number;
}
