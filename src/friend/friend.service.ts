import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Brackets, In, Not, Repository } from 'typeorm';
import { Friend } from './entities/friend.entity';
import { Worldcup } from 'src/worldcup/entities/worldcup.entity';
import { User } from 'src/user/entities/user.entity';
import { SetFriendDto } from './dto/set-friend.dto';
import { CreateFriendDto } from './dto/create-friend.dto';
import { ReplyFriendDto } from './dto/reply-friend.dto';

@Injectable()
export class FriendService {

  constructor(
    @Inject('FRIEND_REPOSITORY') private friendRepository: Repository<Friend>,
    @Inject('WORLDCUP_REPOSITORY') private worldcupRepository: Repository<Worldcup>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('friend.service.ts');

  // 술친구 추천
  async setFriends(setFriendDto: SetFriendDto) {
    try {
        // 1. 프론트에서 전송한 해당회원정보(user_email)를 받아옴.
        const {user_email} = setFriendDto;
        const user = await this.userRepository.findOne({where:{user_email:user_email}});
        const worldcup = await this.worldcupRepository.findOne({where:{user_email:user_email}});
        if (!user) {
            return {message: `해당 회원이 존재하지 않습니다. 입력된 회원 : ${user_email}`, data:null, statuscode:404};
        }
        if (!worldcup) {
            return {message: `주류월드컵 정보가 없는 회원입니다. 입력된 회원 : ${user_email}`, data:null, statuscode:404};
        }
        const {user_add} = user;
        const {worldcup_result} = worldcup;
        // 2. 비교추천로직을 위해 회원의 주소(user_add)와 주류월드컵 결과(worldcup_result) 정보에서 일부 데이터 추출.
        const userCity = user_add.split(' ')[0];
        const worldcupResults = worldcup_result.split((','));       // const worldcupFirst = worldcup_result.split(',')[0];   const worldcupSecond = worldcup_result.split(',')[1];   const worldcupThird = worldcup_result.split(',')[2];   const worldcupForth = worldcup_result.split(',')[3];
        // 3. 추출한 데이터를 바탕으로 술친구 추천 로직 쿼리 실행.
        const friends = await this.userRepository
            .createQueryBuilder('a')
            .select([
                'a.user_idx',
                'a.user_nickname',
                'a.user_email',
                'a.user_add',
                'b.worldcup_result'
            ])
            .innerJoin('tb_worldcup', 'b', 'a.user_email = b.user_email')       // 'tb_user'와 'tb_worldcup'의 JOIN
            .where('a.user_email != :email', {email: user_email})       // 해당 회원을 제외한 나머지 회원정보들을 추출
            .andWhere('a.user_add LIKE :address', {address: `${userCity}%`})        // 첫번째조건 = 회원의 사는 지역과 동일한 회원들만 추출
            .andWhere(new Brackets(qb => {      // 두번째조건 = 반복문을 통해 입력된 회원의 주류월드컵 결과와 유사한 회원들만 추출
                worldcupResults.forEach((result, index) => {
                    qb.orWhere(`b.worldcup_result LIKE :number${index}A`, {[`number${index}A`]: `%,${result}`})
                    .orWhere(`b.worldcup_result LIKE :number${index}B`, {[`number${index}B`]: `${result},%`})
                    .orWhere(`b.worldcup_result LIKE :number${index}C`, {[`number${index}C`]: `%,${result},%`});
                });
            }))
            .orderBy('RAND()')
            .limit(5)
            .getMany();
        // 4. 추천로직 결과가 없을때(같은 지역구 인원이 없을때) 예외 처리.
        if (friends.length === 0) {
            return {message: '매칭된 인원이 없습니다.', data: null, statusCode: 200};
        }
        return friends;
    } catch (error) {
        this.logger.error('술친구 추천 데이터 전송 중 오류 발생');
        this.logger.error(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 술친구 메일전송
  async sendFriendMail(createFriendDto: CreateFriendDto) {
    try {
        const {friend_email, friend_text, user_email} = createFriendDto;
        const user = await this.userRepository.findOne({where:{user_email:user_email}});
        if (!user) {
            return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
        }
        const friendNickname = await this.userRepository.findOne({where:{user_email:friend_email}});
        if (!friendNickname) {
            return {message:`해당 술친구 회원이 없습니다. 입력된 회원 : ${friend_email}`, statusCode:404};
        } else if (friendNickname.user_email === user.user_email) {
            return {message:`자신에게 전송할 수는 없습니다.. 입력된 회원 : ${friend_email}`, statusCode:404};
        }
        const friend = new Friend();
        friend.user_nickname = user.user_nickname;
        friend.friend_nickname = friendNickname.user_nickname;
        friend.friend_email = createFriendDto.friend_email;
        friend.friend_text = createFriendDto.friend_text;
        friend.friend_match = 'W';
        friend.user_email = user.user_email;
        await this.friendRepository.save(friend);
        return {message:`[${user.user_nickname}]님이 [${friendNickname.user_nickname}]님에게 술친구 메일전송 완료`, data:friend, statusCode:200};
    } catch (error) {
        this.logger.error('술친구 메일 전송 중 오류 발생');
        this.logger.error(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 술친구 메일답장
  async replyFriendMail(replyFriendDto: ReplyFriendDto) {
    try {
        const {friend_reply, friend_match, user_email} = replyFriendDto;
        const friend = await this.friendRepository.findOne({where:{friend_email: user_email}});
        if (!friend) {
            return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
        }
        friend.friend_reply = friend_reply || friend.friend_reply;
        friend.friend_match = friend_match || friend.friend_match;
        const replyFriend = await this.friendRepository.save(friend);
        return {message:`[${friend.friend_nickname}]님이 [${friend.user_nickname}]님에게 술친구 메일답장 완료`, data:replyFriend, statusCode:200};
    } catch (error) {
        this.logger.error('술친구 메일 답장 중 오류 발생');
        this.logger.error(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 술친구 메일확인 (자신이 전송한 술친구요청)
  async getSendMail(user_email) {
    try {
        const usercheck = await this.userRepository.findOne({where:{user_email: user_email}});
        if (!usercheck) {
            return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
        }
        const user = await this.friendRepository.find({where:{user_email: user_email}});
        return {message: `[${user_email}]님이 전송한 술친구요청`, data: user, statusCode: 200};
    } catch (error) {
        this.logger.error('자신이 전송한 술친구 요청 확인 중 오류 발생');
        this.logger.error(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 술친구 메일확인 (자신에게 온 술친구요청)
  async getReadMail(user_email) {
    try {
        const usercheck = await this.userRepository.findOne({where:{user_email: user_email}});
        if (!usercheck) {
            return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
        }
        const user = await this.friendRepository.find({where:{friend_email: user_email, friend_status: null}});
        return {message: `[${user_email}]님이 받은 술친구요청`, data: user, statusCode: 200};
    } catch (error) {
        this.logger.error('자신에게 온 술친구 요청 확인 중 오류 발생');
        this.logger.error(error);
        throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 술친구 신고요청

  
}
