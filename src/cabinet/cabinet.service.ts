import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { Repository } from 'typeorm';
import { Cabinet } from './entities/cabinet.entity';
import { Alcohol } from 'src/alcohol/entities/alcohol.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CabinetService {
  
  constructor(
    @Inject('CABINET_REPOSITORY') private cabinetRepository: Repository<Cabinet>,
    @Inject('ALCOHOL_REPOSITORY') private alcoholRepository: Repository<Alcohol>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('cabinet.service.ts');

  // 개인 술장고 입력
  async createCabinet(createCabinetDto: CreateCabinetDto) {
    try {
      const {alcohol_name, cabinet_color, cabinet_aroma, cabinet_flavor, cabinet_review, user_email} = createCabinetDto;
      const user = await this.userRepository.findOne({where:{user_email:user_email}});
      if(!user) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_name:alcohol_name}});
      if(!alcohol) {
        return {message:`해당 주류가 없습니다. 입력된 주류 : ${alcohol_name}`, statusCode:404};
      }
      const cabinet = new Cabinet();
      cabinet.alcohol_name = alcohol.alcohol_name;
      cabinet.cabinet_color = createCabinetDto.cabinet_color;
      cabinet.cabinet_aroma = createCabinetDto.cabinet_aroma;
      cabinet.cabinet_flavor = createCabinetDto.cabinet_flavor;
      cabinet.cabinet_review = createCabinetDto.cabinet_review;
      cabinet.cabinet_updatedate = null;
      cabinet.user_email = user.user_email;
      await this.cabinetRepository.save(cabinet);
      return {message:'개인 술장고 입력완료', data:cabinet, statusCode:200};
    } catch (error) {
      this.logger.error('개인 술장고 입력중 서버 오류 발생');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
