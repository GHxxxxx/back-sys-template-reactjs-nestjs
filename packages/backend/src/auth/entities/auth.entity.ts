import { Column ,Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class user {
    // id为主键并且自动递增
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string
}
