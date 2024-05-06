import { Alcohol } from "src/alcohol/entities/alcohol.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_subscribe')
export class Subscribe extends BaseEntity {

    // 찜_고유번호
    @PrimaryGeneratedColumn()
    subscribe_idx!: number;

    // 주류_고유번호(FK)
    @Column({nullable: true})
    alcohol_idx: number;

    // 찜_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    subscribe_createdate: string;

    // 찜_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    subscribe_deletedate: string;

    // 회원_이메일(FK)
    @Column()
    user_email: string;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    user: User;

    // 주류 JOIN
    @ManyToOne(() => Alcohol)
    @JoinColumn({name: 'alcohol_idx', referencedColumnName: 'alcohol_idx'})
    alcohol: Alcohol;

}
