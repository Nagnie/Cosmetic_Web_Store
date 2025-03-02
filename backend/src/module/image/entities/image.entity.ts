import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "product_image"})
export class Image {
    @PrimaryGeneratedColumn({name: "id_img"})
    id: number;

    @Column({name: "id_pro"})
    id_pro: number;

    @Column({name: "link"})
    url: string;
}
