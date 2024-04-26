import { ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { InputStoreDto } from './dto/input-store.dto';
import { SftpService } from 'src/sftp/sftp.service';
import { v4 as uuidv4 } from 'uuid';
import { Subimg } from './entities/subimg.entity';
import { Menu } from 'src/menu/entities/menu.entity';

@Injectable()
export class StoreService {

  constructor(
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('SUBIMG_REPOSITORY') private subimgRepository: Repository<Subimg>,
    @Inject('MENU_REPOSITORY') private menuRepository: Repository<Menu>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {};

  private logger = new Logger('store.service.ts');

  // 사업자 스토어 신청 (가맹회원 가입시 해당 정보를 입력하는 로직으로 통합함으로 현재는 사용되지 않음)
  // async requestStore(createStoreDto: CreateStoreDto) {
  //   try {
  //     const {store_name, store_registnum, store_ownername, store_phone, store_postcode, store_add, store_adddetail, store_status, user_email} = createStoreDto;
  //     const storeCheckInWithdrawn = await this.storeRepository.findOne({where:{store_registnum, store_status:'W'}});
  //     if(storeCheckInWithdrawn) {
  //       return {message:`이미 신청대기중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`, statusCode:409};
  //     }
  //     const storeCheckInActive = await this.storeRepository.findOne({where:{store_registnum, store_status:'A'}});
  //     if(storeCheckInActive) {
  //       return {message:`이미 활동중인 점포입니다. 입력하신 사업자번호 : ${store_registnum}`, statusCode:409};
  //     }
  //     // const storeCheckUser = await this.storeRepository.findOne({where:{user_email}});
  //     // if(!storeCheckUser) {
  //     //   throw new NotFoundException(`해당 회원은 회원테이블에 등록되지 않은 회원입니다. 입력된 회원 : ${user_email}`);
  //     // }
  //     const store = this.storeRepository.create({
  //       store_name,
  //       store_registnum,
  //       store_ownername,
  //       store_phone,
  //       store_postcode,
  //       store_add,
  //       store_adddetail,
  //       store_status: 'W',   // 점포가입신청 시 기본 상태값 지정 ( W = 가맹회원 신청가입대기중 )
  //       store_updatedate: null,    //  updateColumn 초기값으로 Null 지정
  //       user_email,
  //     });
  //     await this.storeRepository.save(store);
  //     return {message:'스토어 가입신청완료', data:store, statusCode:200};
  //   } catch (error) {
  //     this.logger.error('스토어 정보 입력 중 서버 문제 발생.');
  //     this.logger.error(`에러내용 : ${error}`);
  //     console.log(error);
  //     throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
  //   }
  // }

  // 가입허가된 가맹주 개인스토어 정보 기입
  async inputInfoStore(mainimg, subimg, inputStoreDto: InputStoreDto) {
    console.log(mainimg.originalname);
    console.log(subimg.map(file => file.originalname));
    console.log(inputStoreDto);
    // 1. 데이터베이스 트랜잭션을 관리하기 위한 QueryRunner 생성
    const queryRunner = this.storeRepository.manager.connection.createQueryRunner();
    // 2. QueryRunner 연결 및 트랜잭션 시작
    await queryRunner.connect();
    // await queryRunner.startTransaction();
    const isTransactionActive = queryRunner.isTransactionActive;
    if (!isTransactionActive) {
        await queryRunner.startTransaction();
    }
    try {
      const {store_opentime, store_closetime, store_info, user_email} = inputStoreDto;
      const store = await this.storeRepository.findOne({where:{user_email, store_status:'A'}});
      if(!store) {
        return {message:`일치하는 스토어가 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }

      // 메인이미지 (0~1장) 파일 업로드 로직
      if (mainimg) {    // 메인이미지가 첨부된 경우에만 처리
        if (!mainimg.buffer) {
          this.logger.error(`파일 객체에 buffer 속성이 포함되어 있지 않습니다. (MainIMG)`);
          throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
        }
        const fileExtension = mainimg.originalname.split('.').pop();    // 파일이름과 확장자 분리. pop를 사용하여 배열 마지막 요소인 파일확장자를 가져옴
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;    // 파일 유니크명 생성
        const store_mainimg_name = `${mainimg.originalname}`;   // 이미지 파일 정보 (원본파일명)
        const store_mainimg_key = `${uniqueFileName}`;    // 이미지 파일 정보 (유니크명)
        const store_mainimg_path = `uploads/drunkwhale/store/mainimg/${uniqueFileName}`;    // 이미지 파일 정보 (경로)
          // 이전 이미지 경로 저장
          const previousMainImgPath = store.store_mainimgpath;
          this.logger.debug(`기존의 메인 사진 파일 경로 : [${previousMainImgPath}]`);
          // 새로운 이미지 업로드
          const buffer = mainimg.buffer;
          await this.sftpService.uploadFileFromBuffer(buffer, `uploads/drunkwhale/store/mainimg/${uniqueFileName}`);
          // 이전 메인 이미지 삭제
          if (previousMainImgPath) {
            await this.sftpService.deleteFile(previousMainImgPath);
          }
        // 주류 객체에 새로운 이미지 정보 할당
        store.store_mainimgname = store_mainimg_name;   // 이미지 파일 정보 데이터베이스에 입력
        store.store_mainimgkey = store_mainimg_key;
        store.store_mainimgpath = store_mainimg_path;
        this.logger.debug(`[${store.user_email}]님의 스토어 메인이미지 SFTP서버로 전송 완료`);
      }

      // 서브이미지 (0~10장) 파일 업로드 로직
      if (subimg && subimg.length > 0) {    // 서브이미지가 첨부된 경우에만 처리
          const storeIdx = store.store_idx;  // 스토어 고유번호 저장
          // 이전 서브이미지가 있는지 확인
          const previousSubImages = await this.subimgRepository.find({where:{store_idx: storeIdx}});
          if (previousSubImages.length > 0) {
            // 이전 서브이미지들 삭제
            for (const previousSubImage of previousSubImages) {
                await this.sftpService.deleteFile(previousSubImage.store_subimgpath);
                await this.subimgRepository.remove(previousSubImage);
            }
          }
        // 새로운 서브이미지 업로드 및 저장
        for (const subImage of subimg) {    // 반복문 사용해서 한개씩 처리
            if (!subImage.buffer) {
              this.logger.error(`파일 객체에 buffer 속성이 포함되어 있지 않습니다. (SubIMG)`);
              throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
            }
            const subFileExtension = subImage.originalname.split('.').pop();
            const subUniqueFileName = `${uuidv4()}.${subFileExtension}`;
            const store_subimg_name = `${subImage.originalname}`;
            const store_subimg_key = `${subUniqueFileName}`;
            const store_subimg_path = `uploads/drunkwhale/store/subimg/${subUniqueFileName}`;
            // Sub Image 저장 처리
            const buffer = subImage.buffer;
            await this.sftpService.uploadFileFromBuffer(buffer, store_subimg_path);
            // Subimg 객체 생성 및 저장
            const newSubimg = new Subimg();
            newSubimg.store = store;
            newSubimg.store_subimgname = store_subimg_name;
            newSubimg.store_subimgkey = store_subimg_key;
            newSubimg.store_subimgpath = store_subimg_path;
            await queryRunner.manager.save(newSubimg);
        }
      }

      // 파일 제외 나머지 정보 저장
      store.store_opentime = inputStoreDto.store_opentime;
      store.store_closetime = inputStoreDto.store_closetime;
      store.store_info = inputStoreDto.store_info;
      // 3. 스토어 정보 트랜잭션 저장. 기존 코드 변경. ( 기존코드 => const inputStore = await this.storeRepository.save(store); )
      await queryRunner.manager.save(store);
      this.logger.debug(JSON.stringify(store.user_email) + ' 님의 스토어정보입력 완료');
      // 4. 모든 작업이 성공하면 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return {
        message:'스토어 정보 입력이 완료되었습니다.',
        data:{
          store_mainimg: store.store_mainimgname,
          // store_subimg: subimg.map(subimg => subimg.store_subimgpath),
          store_subimg: subimg.map(subimg => subimg.originalname),
          store_name: store.store_name,
          store_opentime: store.store_opentime,
          store_closetime: store.store_closetime,
          store_info: store.store_info
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


  // 스토어 전체보기
  async getStores(page: number = 1) {
    try {
      const take = 10;
      const [stores, total] = await this.storeRepository.findAndCount({
        select: ['store_idx', 'store_mainimgpath', 'store_name', 'store_add', 'store_adddetail', 'store_opentime', 'store_closetime'],
        take,
        skip: page<=0 ? page=0 : (page-1)*take,
        order: {store_idx: 'DESC'},
      });
      const lastPage = Math.ceil(total / take);
      if (lastPage >= page) {
        return {
          data: stores,
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
      this.logger.error('스토어 정보 전체읽기 중 오류 발생');
      this.logger.error(error);
      return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
    }
  }

  // 스토어 상세보기
  async getStoreDetail(idx: number) {
    try {
      const store = await this.storeRepository.findOne({
        select: ['store_idx', 'store_name', 'store_ownername', 'store_phone', 'store_mainimgpath', 'store_add', 'store_adddetail', 'store_opentime', 'store_closetime', 'store_info', 'store_status', 'store_createdate', 'user_email'],
        where: {store_idx: idx, store_status: 'A'},
      });
      const subimg = await this.subimgRepository.find({
        select: ['subimg_idx', 'store_subimgpath'],
        where: {store_idx: idx},
      })
      const menu = await this.menuRepository.find({
        select: ['menu_idx', 'menu_name', 'menu_imgpath', 'menu_type', 'menu_info', 'menu_price'],
        where: {store_idx: idx},
      })
      if (store) {
        return {message: `입력된 스토어IDX : [${idx}]`, store: [store,subimg], menu: [menu], statusCode: 200};
      } else {
        return {message: `해당 스토어를 찾을 수 없거나, 허가 받지 못한 스토어입니다. 입력된 스토어IDX : [${idx}]`, data: null, statusCode: 404};
      }
    } catch (error) {
      this.logger.error('스토어정보 상세읽기 중 오류 발생');
      this.logger.error(error);
      return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
    }
  }

}
