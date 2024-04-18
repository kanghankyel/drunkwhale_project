import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateSubscribeDto } from './dto/create-subscribe.dto';
import { Repository } from 'typeorm';
import { Subscribe } from './entities/subscribe.entity';
import { Alcohol } from 'src/alcohol/entities/alcohol.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class SubscribeService {

  constructor(
    @Inject('SUBSCRIBE_REPOSITORY') private subscribeRepository: Repository<Subscribe>,
    @Inject('ALCOHOL_REPOSITORY') private alcoholRepository: Repository<Alcohol>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('subscribe.service.ts');

  // 주류 찜하기
  async subscribeAlcohol(createSubscribeDto: CreateSubscribeDto) {
    try {
      const {alcohol_name, user_email} = createSubscribeDto;
      const user = await this.userRepository.findOne({where:{user_email:user_email}});
      if(!user) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_name:alcohol_name}});
      if(!alcohol) {
        return {message:`해당 주류가 없습니다. 입력된 주류 : ${alcohol_name}`, statusCode:404};
      }
      const duplicate = await this.subscribeRepository.findOne({where:{user_email:user_email, alcohol_name:alcohol_name}});
      if(duplicate) {
        return {message:`이미 해당 주류를 찜했습니다. 입력된 주류 : ${alcohol_name}`, statusCode:400};
      }
      const subscribe = new Subscribe();
      subscribe.alcohol_name = alcohol.alcohol_name;
      subscribe.user_email = user.user_email;
      await this.subscribeRepository.save(subscribe);
      return {message:'찜하기 완료', data:subscribe, statusCode:200};
    } catch (error) {
      this.logger.error('찜하기 입력중 서버 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 주류 찜하기 삭제
  async deleteSubscribe(subscribe_idx) {
    try {
      const subscribe = await this.subscribeRepository.findOne({where:{subscribe_idx:subscribe_idx}});
      if (!subscribe) {
        return {message: `해당되는 목록 없습니다. 입력된 찜하기번호 : [${subscribe_idx}]`, data: null,statusCode: 404};
      }
      await this.subscribeRepository.remove(subscribe);
      return {message: `주류 삭제 완료. 삭제된 주류번호 : [${subscribe_idx}]`, data: subscribe, statusCode: 200}
    } catch (error) {
      this.logger.error('찜하기 삭제중 서버 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
