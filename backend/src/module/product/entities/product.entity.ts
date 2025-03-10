import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn({name: "id_pro"})
    id_pro: number;

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
