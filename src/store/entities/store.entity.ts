import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_store')
export class Store extends BaseEntity {

    // 스토어_고유번호
    @PrimaryGeneratedColumn('increment')
    store_idx!: number;

    // 스토어_상호명
    @Column({nullable: true})
    store_name: string;

    // 스토어_사업자등록번호
    @Column({nullable: true})
    store_registnum: string;

    // 스토어_대표자명
    @Column({nullable: true})
    store_ownername: string;

    // 스토어_사업자전화번호
    @Column({nullable: true})
    store_phone: string;

    // 스토어_유형
    @Column({nullable: true})
    store_type: string;

    // 스토어_대표이미지
    @Column({nullable: true})
    store_mainimg: string;

    // 스토어_서브이미지
    @Column('text', {array: true, nullable: true})      // 복수의 파일경로를 저장하기 위해 배열 형태로 지정
    store_subimg: string[];

    // 스토어_우편번호
    @Column({nullable: true})
    store_postcode: string;

    // 스토어_주소
    @Column({nullable: true})
    store_add: string;

    // 스토어_상세주소
    @Column({nullable: true})
    store_adddetail: string;

    // 스토어_개장시간
    @Column({nullable: true})
    store_opentime: string;

    // 스토어_마감시간
    @Column({nullable: true})
    store_closetime: string;

    // 스토어_소개정보
    @Column({nullable: true})
    store_info: string;

    // 스토어_점수
    @Column({nullable: true, default: 0})
    store_score: number;

    // 스토어_상태
    @Column({nullable: true})
    store_status: string;

    // 스토어_생성일
    @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    store_createdate!: string;

    // 스토어_수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    store_updatedate: string;

    // 스토어_삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    store_deletedate: string;

    // 가맹주_이메일 (FK)
    @Column({nullable: true})
    user_email: string;

    // 가맹주 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})       // referencedColumnName를 하지 않으니 user_email컬럼 형태를 Integer로 구성하는 문제가 있음
    user: User;

}
