import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './entities/dog.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';

@Injectable()
export class DogService {

  constructor(
    @Inject('DOG_REPOSITORY') private dogRepository: Repository<Dog>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {};

  private logger = new Logger('dog.service.ts');

  // 회원 반려동물 정보입력
  async createDog(createDogDto: CreateDogDto, file: Express.Multer.File) {
    try {
      const {dog_image, dog_name, dog_gender, dog_species, dog_size, dog_birth, dog_personality, dog_info, user_email} = createDogDto;
      const user = await this.userRepository.findOne({where:{user_email:user_email, user_status:'A'}});
      if(!user) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      const dog = new Dog();
      const dog_image_path = `uploads/${file.originalname}`;    // 이미지 파일 경로 정보
      dog.dog_image = dog_image_path;
      dog.dog_name = createDogDto.dog_name;
      dog.dog_gender = createDogDto.dog_gender;
      dog.dog_species = createDogDto.dog_species;
      dog.dog_size = createDogDto.dog_size;
      dog.dog_birth = createDogDto.dog_birth;
      dog.dog_personality = createDogDto.dog_personality;
      dog.dog_info = createDogDto.dog_info;
      dog.dog_updatedate = null;
      dog.user_email = user.user_email;
      await this.dogRepository.save(dog);
      this.logger.debug(JSON.stringify(user.user_email) + ' 님의 애완견정보입력 완료');
      // SFTP서버에 파일 upload
      await this.sftpService.connect();
      await this.sftpService.uploadFile(file.path, `remote-path/${file.originalname}`);
      await this.sftpService.disconnect();
      this.logger.debug(JSON.stringify(user.user_email) + ' 님의 애완견정보 SFTP서버로 전송 완료');
      return {message:`${user_email}님의 애완견정보입력 완료`, data:dog, statusCode:200};
    } catch (error) {
      this.logger.error('강아지정보 등록 중 오류 발생');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 회원 반려동물 정보보기(개인)
  async getMyPets(user_email: string) {
    try {
      if(!user_email) {
        this.logger.error('요청에서 user_email이 제공되지 않았습니다.');
        return {message:'요청에서 user_email이 제공되지 않았습니다.', statusCode:400};
      }
      const user = await this.userRepository.findOne({where:{user_email:user_email, user_status:'A'}});
      if(!user) {
        return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      const dogs = await this.dogRepository.find({where:{user_email: user.user_email}});    // 회원테이블의 user_email에 해당하는 user_idx를 가져와서 강아지테이블의 user_idx에 대입하여 해당 정보 추출.
      return {message:`${user_email}님의 애완견정보`, data:dogs, statusCode:200};
    } catch (error) {
      this.logger.error('강아지정보 확인 중 오류 발생');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
