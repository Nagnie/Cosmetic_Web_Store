import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn({name: "id_pro"})
    id_pro: number;

    @Column({name: "name"})
    name: string;
}
