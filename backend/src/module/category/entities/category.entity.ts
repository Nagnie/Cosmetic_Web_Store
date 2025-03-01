import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "category"})
export class Category {
    @PrimaryGeneratedColumn({name: "id_cat"})
    id: number;

    @Column({name: "name"})
    name: string;
}
