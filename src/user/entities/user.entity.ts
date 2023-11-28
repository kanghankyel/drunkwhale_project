import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    user_idx!: number;

    @Column()
    user_id: string;

    @Column()
    user_pw: string;

    @Column()
    user_info: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    user_createdate!: string;

}