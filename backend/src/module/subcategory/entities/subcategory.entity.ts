import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "sub_category"})
export class Subcategory {
    @PrimaryGeneratedColumn({name: "id_subcat"})
    id: number;

    @Column({name: "name"})
    name: string;

    @Column({name: "id_cat"})
    id_cat: number;
}
