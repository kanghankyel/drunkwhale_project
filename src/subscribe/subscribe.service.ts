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
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
