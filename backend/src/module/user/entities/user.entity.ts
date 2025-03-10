import moment from "moment";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "account"})
export class User {
    @PrimaryGeneratedColumn({name: "id_acc"})
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;
}