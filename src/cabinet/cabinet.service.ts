import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCabinetDto } from './dto/create-cabinet.dto';
import { Repository } from 'typeorm';
import { Cabinet } from './entities/cabinet.entity';
import { Alcohol } from 'src/alcohol/entities/alcohol.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateCabinetDto } from './dto/update-cabinet.dto';

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
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 개인 술장고 읽기
  async readCabinet(userEmail, page: number = 1) {
    try {
      const take = 10;
      const usercheck = await this.userRepository.findOne({where:{user_email: userEmail}});
      if (!usercheck) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${userEmail}`, statusCode:404};
      }
      const [cabinets, total] = await this.cabinetRepository.findAndCount({
        select: ['cabinet_idx', 'alcohol_name', 'cabinet_color', 'cabinet_aroma', 'cabinet_flavor', 'cabinet_review'],
        where: {user_email: userEmail},
        take,
        skip: page<=0 ? page=0 : (page-1)*take,
        order: {cabinet_idx: 'DESC'},
      });
      if (total === 0) {
        return {message: `아직 등록된 정보가 없습니다.`, data: null, statusCode: 404};
      }
      const lastPage = Math.ceil(total / take);
      if (lastPage >= page) {
        return {
          message: `[${userEmail}]님의 술장고 정보`,
          data: cabinets,
          meta: {
            total,
            page: page<=0 ? page=1 : page,
            lastPage: lastPage,
          }
        };
      } else {
        return {message: `해당 페이지는 존재하지 않습니다. 입력된 페이지 : [${page}]`, data: null, statusCode: 404};
      }
    } catch (error) {
      this.logger.error('개인 술장고 읽기중 서버 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 개인 술장고 수정
  async updateCabinet(updateCabinetDto: UpdateCabinetDto) {
    try {
      const {cabinet_idx, cabinet_color, cabinet_aroma, cabinet_flavor, cabinet_review} = updateCabinetDto;
      const cabinet = await this.cabinetRepository.findOne({where:{cabinet_idx:cabinet_idx}});
      if (!cabinet) {
        return {message: `해당되는 목록은 없습니다. 입력된 술장고번호 : ${cabinet_idx}`, data: null,statusCode: 404};
      }
      // 입력된 정보가 있으면 업데이트, 없으면 기존 정보 유지
      cabinet.cabinet_color = cabinet_color || cabinet.cabinet_color;
      cabinet.cabinet_aroma = cabinet_aroma || cabinet.cabinet_aroma;
      cabinet.cabinet_flavor = cabinet_flavor || cabinet.cabinet_flavor;
      cabinet.cabinet_review = cabinet_review || cabinet.cabinet_review;
      const updateCabinet = await this.cabinetRepository.save(cabinet);
      return {message: `술장고 수정완료`, data: updateCabinet, statusCode: 200};
    } catch (error) {
      this.logger.error('개인 술장고 수정중 서버 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 개인 술장고 삭제
  async deleteCabinet(cabinet_idx: number) {
    try {
      const cabinet = await this.cabinetRepository.findOne({where:{cabinet_idx: cabinet_idx}});
      if (!cabinet) {
        return {message: `해당되는 목록은 없습니다. 입력된 술장고번호 : ${cabinet_idx}`, data: null,statusCode: 404};
      }
      await this.cabinetRepository.remove(cabinet);
      return {message: `술장고 삭제 완료. 삭제된 술장고번호 : [${cabinet_idx}]`, data: cabinet, statusCode: 200};
    } catch (error) {
      this.logger.error('개인 술장고 삭제중 서버 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
