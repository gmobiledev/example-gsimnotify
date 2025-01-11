import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({name:"user", synchronize: false})
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    mobile: string

    @Column()
    uid: string;

    @Column()
    token: string

    @Column()
    os: string

    @Column()
    token_firebase: string;
}