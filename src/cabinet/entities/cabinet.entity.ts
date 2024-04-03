import { Alcohol } from "src/alcohol/entities/alcohol.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_cabinet')
export class Cabinet extends BaseEntity {

    // 술장고_고유번호
    @PrimaryGeneratedColumn()
    cabinet_idx!: number;

    // 주류_이름(FK)
    @Column()
    alcohol_name: string;

    // 술장고_평가(맛)
    @Column()
    cabinet_flavor: string;

    // 술장고_평가(향)
    @Column()
    cabinet_aroma: string;

    // 술장고_평가(외형)
    @Column()
    cabinet_look: string;

    // 술장고_평가(품질)
    @Column()
    cabinet_quality: string;

    // 술장고_평가(균형)
    @Column()
    cabinet_balance: string;

    // 술장고_개인평가
    @Column()
    cabinet_review: string;

    // 술장고_생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    cabinet_createdate: string;

    // 술장고_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    cabinet_updatedate: string;

    // 술장고_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    cabinet_deletedate: string;

    // 회원_이메일(FK)
    @Column()
    user_email: string;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    user: User;

    // 주류 JOIN
    @ManyToOne(() => Alcohol)
    @JoinColumn({name: 'alcohol_name', referencedColumnName: 'alcohol_name'})
    alcohol: Alcohol;

}
