import { ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { InputStoreDto } from './dto/input-store.dto';
import { SftpService } from 'src/sftp/sftp.service';

@Injectable()
export class StoreService {

  constructor(
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {};

  private logger = new Logger('store.service.ts');

  // 사업자 스토어 신청
  async requestStore(createStoreDto: CreateStoreDto) {
    try {
      const {store_name, store_registnum, store_ownername, store_phone, store_type, store_postcode, store_add, store_adddetail, store_status, user_email} = createStoreDto;
      const storeCheckInWithdrawn = await this.storeRepository.findOne({where:{store_registnum, store_status:'W'}});
      if(storeCheckInWithdrawn) {
        return {message:`이미 신청대기중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`, statusCode:409};
      }
      const storeCheckInActive = await this.storeRepository.findOne({where:{store_registnum, store_status:'A'}});
      if(storeCheckInActive) {
        return {message:`이미 활동중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`, statusCode:409};
      }
      // const storeCheckUser = await this.storeRepository.findOne({where:{user_email}});
      // if(!storeCheckUser) {
      //   throw new NotFoundException(`해당 회원은 회원테이블에 등록되지 않은 회원입니다. 입력된 회원 : ${user_email}`);
      // }
      const store = this.storeRepository.create({
        store_name,
        store_registnum,
        store_ownername,
        store_phone,
        store_type,
        store_postcode,
        store_add,
        store_adddetail,
        store_status: 'W',   // 점포가입신청 시 기본 상태값 지정 ( W = 가맹회원 신청가입대기중 )
        store_updatedate: null,    //  updateColumn 초기값으로 Null 지정
        user_email,
      });
      await this.storeRepository.save(store);
      return {message:'스토어 가입신청완료', data:store, statusCode:200};
    } catch (error) {
      this.logger.error('스토어 정보 입력 중 서버 문제 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 가입허가된 가맹주 개인스토어 정보 기입
  async inputInfoStore(mainimg, subimg, inputStoreDto: InputStoreDto) {
    console.log(mainimg.originalname);
    console.log(subimg.map(file => file.originalname));
    // console.log(subimg.map(file => file.buffer));
    console.log(inputStoreDto);
    // 1. 데이터베이스 트랜잭션을 관리하기 위한 QueryRunner 생성
    const queryRunner = this.storeRepository.manager.connection.createQueryRunner();
    // 2. QueryRunner 연결 및 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {store_opentime, store_closetime, store_info, user_email} = inputStoreDto;
      const store = await this.storeRepository.findOne({where:{user_email, store_status:'A'}});
      if(!store) {
        return {message:`일치하는 스토어가 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      // 메인이미지 (0~1장) 파일 업로드 로직
      if (mainimg) {    // 메인이미지가 첨부된 경우에만 처리
        const store_mainimg_path: string = `uploads/${mainimg.originalname}`;   // 메인이미지 파일의 경로
        store.store_mainimg = store_mainimg_path;
        // 메인이미지 파일의 Buffer를 SFTP에 업로드
        const mainImgBuffer = mainimg.buffer;
        await this.sftpService.uploadFileFromBuffer(mainImgBuffer, `uploads/${mainimg.originalname}`);
      }
      // 서브이미지 (0~10장) 파일 업로드 로직
      if (subimg && subimg.length > 0) {    // 서브이미지가 첨부된 경우에만 처리
        const store_subimg_path: string[] = subimg.map(image => `uploads/${image.originalname}`);   // 서브이미지 파일의 경로
        store.store_subimg = store_subimg_path;
        // 서브이미지 파일들을 순회하면서 각 이미지 파일의 Buffer를 SFTP에 업로드
        for (const subImage of subimg) {
          const subImgBuffer = subImage.buffer;   // 현재 순회 중인 서브 이미지 파일의 Buffer를 가져옴
          await this.sftpService.uploadFilesFromBuffer([{buffer: subImgBuffer, originalname: subImage.originalname}]);    // 배열로 전송
        }
      }
      store.store_opentime = inputStoreDto.store_opentime;
      store.store_closetime = inputStoreDto.store_closetime;
      store.store_info = inputStoreDto.store_info;
      // 3. 스토어 정보 트랜잭션 저장. 기존 코드 변경. ( 기존코드 => const inputStore = await this.storeRepository.save(store); )
      const inputStore = await queryRunner.manager.save(store);
      this.logger.debug(JSON.stringify(store.user_email) + ' 님의 스토어정보입력 완료');
      // 4. 모든 작업이 성공하면 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return {
        message:'스토어 정보 입력이 완료되었습니다.',
        data:{
          store_mainimg:inputStore.store_mainimg,
          store_subimg:inputStore.store_subimg,
          store_name:inputStore.store_name,
          store_opentime:inputStore.store_opentime,
          store_closetime:inputStore.store_closetime,
          store_info:inputStore.store_info
        },
        statusCode:200
      };
    } catch (error) {
      // 5. 오류 발생 시 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      this.logger.error('개인스토어 정보 기입 중 서버 문제 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      return {message:`서버 오류 발생. 다시 시도해 주세요.`, error:`${error}`, statusCode:500};
    } finally {
      // 6. QueryRunner 자원 해제
      await queryRunner.release();
    }
  }

}
