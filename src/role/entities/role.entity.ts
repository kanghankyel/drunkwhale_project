import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_role')
export class Role {

    @PrimaryGeneratedColumn()
    role_idx!: number;

    @Column()
    role_type: string;

    @ManyToOne(type => User, user => user.roles)
    @JoinColumn({name: 'user_idx', referencedColumnName: 'user_idx'})
    user: User;

}