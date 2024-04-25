import { Store } from "src/store/entities/store.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('tb_menu')
export class Menu extends BaseEntity {

    // 메뉴 고유번호
    @PrimaryGeneratedColumn('increment')
    menu_idx!: number;

    // 메뉴 상품이미지 (원본파일명))
    @Column({nullable: true})
    menu_imgname: string;

    // 메뉴 상품이미지 (유니크명)
    @Column({nullable: true})
    menu_imgkey: string;

    // 메뉴 상품이미지 (경로)
    @Column({nullable: true})
    menu_imgpath: string;

    // 메뉴 상품명
    @Column({nullable: true})
    menu_name: string;

    // 메뉴 상품타입
    @Column({nullable: true})
    menu_type: string;

    // 메뉴 상품소개
    @Column({nullable: true})
    menu_info: string;

    // 메뉴 상품가격
    @Column({nullable: true})
    menu_price: string;

    // 메뉴 생성일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    menu_createdate: string;

    // 메뉴 수정일
    @UpdateDateColumn({type: 'timestamp', default: null, nullable: true})
    menu_updatedate: string;

    // 메뉴 삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    menu_deletedate: string;

    // 가맹주_이메일 (FK)
    @Column({nullable: true})
    user_email: string;

    // 스토어_고유번호 (FK)
    @Column({nullable: true})
    store_idx: number;

    // 스토어 JOIN
    @ManyToOne(() => Store)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    store: Store;

}
