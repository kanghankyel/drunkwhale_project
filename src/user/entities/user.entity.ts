import { Role } from "src/role/entities/role.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_user')
export class User extends BaseEntity {

    @PrimaryGeneratedColumn('increment')
    user_idx!: number;      // '!' 느낌표가 붙은 거는 이 프로퍼티가 null 또는 undefined가 아니라는 것을 단언하는 것

    @Column({nullable: true})
    user_id: string;

    @Column({nullable: true})
    user_pw: string;

    @Column({nullable: true})
    user_name: string;

    @Column({nullable: true})
    user_nickname: string;
    
    @Column({unique: true, nullable: true})
    user_phone: string;

    @Column({nullable: true})
    user_email: string;

    @Column({nullable: true})
    user_birth: string;

    @Column({nullable: true})
    user_gender: string;

    @Column({nullable: true})
    user_ip: string;

    @Column({nullable: true})
    user_postcode: string;

    @Column({nullable: true})
    user_add: string;

    @Column({nullable: true})
    user_adddetail: string;

    @Column({default: 'A'})
    user_status: string;

    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    user_createdate!: string;

    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    user_updatedate: string | null = null;      // 기본값 초기화

    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    user_deletedate: string;

    @OneToMany(type => Role, role => role.user)     // {eager: true}
    roles?: any[];

}