import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateWorldcupDto } from './dto/create-worldcup.dto';
import { Repository } from 'typeorm';
import { Worldcup } from './entities/worldcup.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WorldcupService {

  constructor(
    @Inject('WORLDCUP_REPOSITORY') private worldcupRepository: Repository<Worldcup>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('world.service.ts');

  // 주류월드컵(32강)

  // 주류월드컵 결과 받기
  async saveWorldcup(createWorldcupDto: CreateWorldcupDto) {
    try {
      const {worldcup_result, user_email} = createWorldcupDto;
      const user = await this.userRepository.findOne({where:{user_email:user_email}});
      if (!user) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      let worldcup = await  this.worldcupRepository.findOne({where:{user_email:user_email}});
      if (worldcup) {
        // 주류월드컵 결과가 해당 회원에게 이미 존재하면 업데이트
        worldcup.worldcup_result = worldcup_result;
        worldcup.worldcup_updatedate = new Date().toISOString();
      } else {
        // 주류월드컵 결과가 해당 회원에게 존재하지 않으면 새로 생성
        worldcup = new Worldcup();
        worldcup.worldcup_result = worldcup_result;
        worldcup.worldcup_updatedate = null;
        worldcup.user_email = user.user_email;
      }
      await this.worldcupRepository.save(worldcup);
      return {message:'주류월드컵 결과 저장완료', data:worldcup, statusCode:200};
    } catch (error) {
      this.logger.error('주류월드컵 결과 서버에 저장 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
