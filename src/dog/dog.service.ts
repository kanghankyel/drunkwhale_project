import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './entities/dog.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class DogService {

  constructor(
    @Inject('DOG_REPOSITORY') private dogRepository: Repository<Dog>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>
  ) {};

  private logger = new Logger('dog.service.ts');

  // 회원 반려동물 정보입력
  async createDog(user_id: string, createDogDto: CreateDogDto) {
    const user = await this.userRepository.findOne({where:{user_id}});
    if(!user) {
      throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_id}`);
    }
    const dog = new Dog();
    dog.dog_name = createDogDto.dog_name;
    dog.dog_gender = createDogDto.dog_gender;
    dog.dog_species = createDogDto.dog_species;
    dog.dog_size = createDogDto.dog_size;
    dog.dog_birth = createDogDto.dog_birth;
    dog.dog_personality = createDogDto.dog_personality;
    dog.dog_info = createDogDto.dog_info;
    dog.dog_updatedate = null;
    dog.user_idx = user.user_idx;
    await this.dogRepository.save(dog);
    this.logger.debug(JSON.stringify(user.user_id) + ' 님의 애완견정보입력 완료');
    return dog;
  }

  // 회원 반려동물 정보보기(개인)
  async getMyPets(user_id: string) {
    const user = await this.userRepository.findOne({where:{user_id}});
    if(!user) {
      throw new NotFoundException(`해당 회원이 없습니다. 입력된 회원 : ${user_id}`);
    }
    const dogs = await this.dogRepository.find({where:{user_idx: user.user_idx}});    // 회원테이블의 user_id에 해당하는 user_idx를 가져와서 강아지테이블의 user_idx에 대입하여 해당 정보 추출.
    return {pets: dogs};
  }

}
