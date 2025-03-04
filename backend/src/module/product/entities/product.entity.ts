import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product"})
export class Product {
    @PrimaryGeneratedColumn({name: "id_pro"})
    id: number;

    @Column({name: "name"})
    name: string;
}
