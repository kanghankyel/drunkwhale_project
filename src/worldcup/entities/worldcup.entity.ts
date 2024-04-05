import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_worldcup')
export class Worldcup extends BaseEntity {

    // 주류월드컵_고유번호
    @PrimaryGeneratedColumn()
    worldcup_idx!: number;

    // 주류월드컵_결과
    @Column({nullable: true})
    worldcup_result: string;

    // 주류월드컵_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    worldcup_createdate: string;

    // 주류월드컵_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    worldcup_updatedate: string;

    // 주류월드컵_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    worldcup_deletedate: string;

    // 회원_이메일(FK)
    @Column()
    user_email: string;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    user: User;

}
