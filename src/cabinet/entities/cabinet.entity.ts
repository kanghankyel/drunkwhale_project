import { Alcohol } from "src/alcohol/entities/alcohol.entity";
import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_cabinet')
export class Cabinet extends BaseEntity {

    // 술장고_고유번호
    @PrimaryGeneratedColumn()
    cabinet_idx!: number;

    // 주류_고유번호(FK)
    @Column()
    alcohol_idx: number;

    // 술장고_평가(색상)
    @Column({nullable: true})
    cabinet_color: string;

    // 술장고_평가(우디)
    @Column({nullable: true})
    cabinet_woody: string;

    // 술장고_평가(씨리얼)
    @Column({nullable: true})
    cabinet_cereal: string;

    // 술장고_평가(페인티)
    @Column({nullable: true})
    cabinet_painty: string;

    // 술장고_평가(플로럴)
    @Column({nullable: true})
    cabinet_floral: string;

    // 술장고_평가(와이니)
    @Column({nullable: true})
    cabinet_winy: string;

    // 술장고_평가(피티)
    @Column({nullable: true})
    cabinet_pitty: string;

    // 술장고_평가(설퍼)
    @Column({nullable: true})
    cabinet_sulper: string;

    // 술장고_평가(프루티)
    @Column({nullable: true})
    cabinet_fruity: string;

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
    @JoinColumn({name: 'alcohol_idx', referencedColumnName: 'alcohol_idx'})
    alcohol: Alcohol;

}
