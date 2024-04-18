import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('tb_friend')
export class Friend extends BaseEntity {

    // 술친구_고유번호
    @PrimaryGeneratedColumn()
    friend_idx!: number;

    // 술친구_회원닉네임
    @Column()
    user_nickname: string;
    
    // 회원_이메일(FK) (메일보내는 사람)
    @Column()
    user_email: string;

    // 술친구_친구닉네임
    @Column()
    friend_nickname: string;

    // 술친구_친구이메일 (메일받는 사람)
    @Column()
    friend_email: string;

    // 술친구_메일내용
    @Column({type: 'text', nullable: true})
    friend_text: string;

    // 술친구_메일답장
    @Column({type: 'text', nullable: true})
    friend_reply: string;

    // 술친구_매칭결과 ( Y=매칭수락, N=매칭거절, W=매칭대기중 )
    @Column()
    friend_match: string;

    // 술친구_메일상태값 ( A=신고요청 )
    @Column({nullable: true})
    friend_status: string;

    // 술친구_메일전송일
    @CreateDateColumn({type: 'timestamp', default: null, nullable: true})
    friend_createdate: string;

    // 술친구_메일삭제일
    @DeleteDateColumn({type: 'timestamp', default: null, nullable: true})
    friend_deletedate: string;

    // 회원 JOIN
    @ManyToOne(() => User)
    @JoinColumn({name: 'user_email', referencedColumnName: 'user_email'})
    user: User;

}
