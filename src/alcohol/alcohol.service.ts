import {Inject, Injectable, InternalServerErrorException, Logger, NotFoundException} from '@nestjs/common';
import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { Alcohol } from './entities/alcohol.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAlcoholDto } from './dto/update-alcohol.dto';
import { PaginationAlcoholDto } from './dto/pagination-alcohol.dto';
import { Weekbottle } from './entities/weekbottle.entity';
import { CreateWeekbottleDto } from './dto/create-weekbottle.dto';
import { skip } from 'node:test';

@Injectable()
export class AlcoholService {

  constructor(
    @Inject('ALCOHOL_REPOSITORY') private alcoholRepository: Repository<Alcohol>,
    @Inject('WEEKBOTTLE_REPOSITORY') private weekbottleRepository: Repository<Weekbottle>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {}

  private logger = new Logger('alcohol.service.ts');

  // 주류 정보입력(관리자)
  async createAlcohol(createAlcoholDto: CreateAlcoholDto, file: Express.Multer.File) {
    // 1. 데이터베이스 트랜잭션을 관리하기 위한 QueryRunner 생성
    const queryRunner = this.alcoholRepository.manager.connection.createQueryRunner();
    // 2. QueryRunner 연결 및 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {alcohol_name, alcohol_ename, alcohol_type, alcohol_class, alcohol_from, alcohol_percent, alcohol_manufacturer, alcohol_importer, alcohol_color, alcohol_woody, alcohol_cereal, alcohol_painty, alcohol_floral, alcohol_winy, alcohol_pitty, alcohol_sulper, alcohol_fruity, alcohol_info} = createAlcoholDto;
      const alcohol = new Alcohol();
      alcohol.alcohol_name = createAlcoholDto.alcohol_name;
      alcohol.alcohol_ename = createAlcoholDto.alcohol_ename;
      alcohol.alcohol_type = createAlcoholDto.alcohol_type;
      alcohol.alcohol_class = createAlcoholDto.alcohol_class;
      alcohol.alcohol_from = createAlcoholDto.alcohol_from;
      alcohol.alcohol_percent = createAlcoholDto.alcohol_percent;
      alcohol.alcohol_manufacturer = createAlcoholDto.alcohol_manufacturer;
      alcohol.alcohol_importer = createAlcoholDto.alcohol_importer;
      alcohol.alcohol_color = createAlcoholDto.alcohol_color;
      alcohol.alcohol_woody = createAlcoholDto.alcohol_woody;
      alcohol.alcohol_cereal = createAlcoholDto.alcohol_cereal;
      alcohol.alcohol_painty = createAlcoholDto.alcohol_painty;
      alcohol.alcohol_floral = createAlcoholDto.alcohol_floral;
      alcohol.alcohol_winy = createAlcoholDto.alcohol_winy;
      alcohol.alcohol_pitty = createAlcoholDto.alcohol_pitty;
      alcohol.alcohol_sulper = createAlcoholDto.alcohol_sulper;
      alcohol.alcohol_fruity = createAlcoholDto.alcohol_fruity;
      alcohol.alcohol_info = createAlcoholDto.alcohol_info;
      alcohol.alcohol_updatedate = null;
      // SFTP서버에 파일 upload
      if (file) {
        // 이미지가 있을 경우에만 작동되게 하기
        console.log(file);
        if (!file.buffer) {
          this.logger.error(`파일 객체에 buffer 속성이 포함되어 있지 않습니다.`);
          throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
        }
        const fileExtension = file.originalname.split('.').pop(); // 파일이름과 확장자 분리. pop를 사용하여 배열 마지막 요소인 파일확장자를 가져옴
        const uniqueFileName = `${uuidv4()}.${fileExtension}`; // 파일 유니크명 생성
        const alcohol_image_name = `${file.originalname}`; // 이미지 파일 정보 (원본파일명)
        const alcohol_image_key = `${uniqueFileName}`; // 이미지 파일 정보 (유니크명)
        const alcohol_image_path = `uploads/drunkwhale/alcohol/${uniqueFileName}`; // 이미지 파일 정보 (경로)
        alcohol.alcohol_imgname = alcohol_image_name; // 이미지 파일 정보 데이터베이스에 입력
        alcohol.alcohol_imgkey = alcohol_image_key;
        alcohol.alcohol_imgpath = alcohol_image_path;
        const buffer = file.buffer;
        await this.sftpService.uploadFileFromBuffer(buffer, `uploads/drunkwhale/alcohol/${uniqueFileName}`);
        this.logger.debug('주류정보 SFTP서버로 전송 완료');
      }
      // 3. 주류 정보 트랜잭션 저장. 기존 코드 변경. ( 기존코드 => await this.alcoholRepository.save(alcohol); )
      await queryRunner.manager.save(alcohol);
      this.logger.debug('주류 정보입력 완료');
      // 4. 모든 작업이 성공하면 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return {message: `주류 정보입력 완료`, data: alcohol, statusCode: 200};
    } catch (error) {
      // 5. 오류 발생 시 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      if (error.message === 'SFTP 연결 실패.') {
        return {message: 'SFTP 연결 실패로 데이터베이스에 저장 실패하였습니다.', statusCode: 500};
      } else {
        this.logger.error('주류정보 등록 중 오류 발생');
        this.logger.error(error);
        return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
      }
    } finally {
      // 6. QueryRunner 자원 해제
      await queryRunner.release();
    }
  }

  // 등록된 주류 정보보기
  async getReadAlcohol(query: PaginationAlcoholDto) {
    try {
      let page = query.page || 1;   // 페이지 기본값 '1' 설정
      let sort = query.sort || 'A';   // 정렬기준 기본값 'A' 설정
      let sortclass = query.sortclass || '';    // 검색기준 기본값 '싱글 몰트 위스키' 설정 -> 전체보기로 변경
      const take = 10;    // 가져오는 데이터 개수 설정
      const skip = page<=0 ? 0 : (page-1)*take;   // 페이지네이션을 위한 skip 설정
      let order = 'alcohol.alcohol_idx';    // 정렬 기준 설정
      let orderDirection: 'ASC' | 'DESC' = 'DESC';    // 정렬기준 방향 설정   // let orderDirection = 'DESC'; <- 정렬 기준 설정 (리터럴 타입으로 변환해야 사용가능. 아래코드로 변경)
      // sort 정렬조건에 따른 order와 orderDirection 설정
      if (sort === 'A') {           // 최신순 정렬
        order = 'alcohol.alcohol_idx';
        orderDirection = 'DESC';
      } else if (sort === 'B') {    // 등록순 정렬
        order = 'alcohol.alcohol_idx';
        orderDirection = 'ASC';
      } else if (sort === 'C') {    // 한글이름 오름차순 정렬
        order = 'alcohol.alcohol_name';
        orderDirection = 'ASC';
      } else if (sort === 'D') {    // 한글이름 내림차순 정렬
        order = 'alcohol.alcohol_name';
        orderDirection = 'DESC';
      } else if (sort === 'E') {    // 주류도수 높은 순 정렬
        order = `CAST(alcohol.alcohol_percent AS DECIMAL(5,2))`;
        orderDirection = 'DESC';
      } else if (sort === 'F') {    // 주류도수 낮은 순 정렬
        order = `CAST(alcohol.alcohol_percent AS DECIMAL(5,2))`;
        orderDirection = 'ASC';
      }
      // 쿼리빌더를 사용하여 데이터 조회
      const queryBuilder = this.alcoholRepository.createQueryBuilder('alcohol')
        .select([
          'alcohol.alcohol_idx',
          'alcohol.alcohol_name',
          'alcohol.alcohol_ename',
          'alcohol.alcohol_imgpath',
          'alcohol.alcohol_class',
          'alcohol.alcohol_from',
          'alcohol.alcohol_percent',
        ])
        .take(take)
        .skip(skip);
        // 주류도수로 정렬하는 경우 추가 정렬
        if (sort === 'E' || sort === 'F') {
          queryBuilder.orderBy(`CAST(alcohol.alcohol_percent AS DECIMAL(5,2))`, orderDirection);
        } else {
          queryBuilder.orderBy(order, orderDirection);
        }
        // alcohol_class 값이 전송된 경우 해당하는 주류만 필터링
        if (sortclass) {
          queryBuilder.andWhere('alcohol.alcohol_class = :sortclass', {sortclass});
        }
      // 데이터 조회 및 반환
      const [alcohols, total] = await queryBuilder.getManyAndCount();
      const lastPage = Math.ceil(total / take);
      // 기존 페이지네이션코드
      // const [alcohols, total] = await this.alcoholRepository.findAndCount({
      //   select: ['alcohol_idx', 'alcohol_name', 'alcohol_ename', 'alcohol_imgpath', 'alcohol_class', 'alcohol_from', 'alcohol_percent'],
      //   take,
      //   skip: page<=0 ? page=0 : (page-1)*take,   // page값이 0이하의 값으로 요청되면 첫번째 페이지를 반환하도록 삼항연산자를 사용해서 구현.
      //   order: {alcohol_idx: 'DESC'},
      // });
      if (lastPage >= page) {
        return {
          data: alcohols,
          meta: {
            total,
            page: page<=0 ? page=1 : page,     // page가 0이하일 경우 page=1를 가지도록 한다.
            lastPage: lastPage,
          }
        };
      } else {
        return {message: `해당 페이지는 존재하지 않습니다. 입력된 페이지 : [${page}]`, data: null, statusCode: 404};
      }
    } catch (error) {
      this.logger.error('주류정보 전체읽기 중 오류 발생');
      this.logger.error(error);
      return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
    }
  }

  // 등록된 주류 상세보기
  async getReadAlcoholDetail(idx: number) {
    try {
      const alcohol = await this.alcoholRepository.findOne({
        select: [
          'alcohol_idx',
          'alcohol_name',
          'alcohol_ename',
          'alcohol_imgpath',
          'alcohol_type',
          'alcohol_class',
          'alcohol_from',
          'alcohol_percent',
          'alcohol_manufacturer',
          'alcohol_importer',
          'alcohol_color',
          'alcohol_woody',
          'alcohol_cereal',
          'alcohol_painty',
          'alcohol_floral',
          'alcohol_winy',
          'alcohol_pitty',
          'alcohol_sulper',
          'alcohol_fruity',
          'alcohol_info'],
        where: {alcohol_idx: idx},
      });
      if (alcohol) {
        return {message: `입력된 주류ID : [${idx}]`, data: alcohol, statusCode: 200};
      } else {
        return {message: `해당 주류를 찾을 수 없습니다. 입력된 ID : [${idx}]`, data: null, statusCode: 404};
      }
    } catch (error) {
      this.logger.error('주류정보 상세읽기 중 오류 발생');
      this.logger.error(error);
      return {message: `서버 오류 발생. 다시 시도해 주세요.`, error: `${error}`, statusCode: 500};
    }
  }

  // 주류 정보수정
  async updateAlcohol(updateAlcoholDto: UpdateAlcoholDto, file: Express.Multer.File,) {
    const queryRunner = this.alcoholRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {alcohol_idx, alcohol_name, alcohol_ename, alcohol_type, alcohol_class, alcohol_from, alcohol_percent, alcohol_manufacturer, alcohol_importer, alcohol_color, alcohol_woody, alcohol_cereal, alcohol_painty, alcohol_floral, alcohol_winy, alcohol_pitty, alcohol_sulper, alcohol_fruity, alcohol_info} = updateAlcoholDto;
      // 이전 이미지 경로를 저장할 변수 선언
      let previousImgPath: string | undefined;
      // 주류 객체 조회
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_idx: alcohol_idx}});
      if (!alcohol) {
        return {message: `해당되는 주류는 없습니다. 입력된 주류번호 : ${alcohol_idx}`, data: null, statusCode: 404};
      }
      // 이미지 파일 업로드 로직
      if (file) {
        if (!file.buffer) {
          throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
        }
        const fileExtension = file.originalname.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const alcohol_image_name = `${file.originalname}`;
        const alcohol_image_key = `${uniqueFileName}`;
        const alcohol_image_path = `uploads/drunkwhale/alcohol/${uniqueFileName}`;
        const buffer = file.buffer;
        // 이전 이미지 경로 저장
        previousImgPath = alcohol.alcohol_imgpath;
        this.logger.debug(`기존의 사진 파일 경로 : [${previousImgPath}]`);
        // 이전 이미지 삭제
        if (previousImgPath) {
          await this.sftpService.deleteFile(previousImgPath);
        }
        // 새로운 이미지 업로드
        await this.sftpService.uploadFileFromBuffer(buffer, alcohol_image_path);
        // 주류 객체에 새로운 이미지 정보 할당
        alcohol.alcohol_imgname = alcohol_image_name;
        alcohol.alcohol_imgkey = alcohol_image_key;
        alcohol.alcohol_imgpath = alcohol_image_path;
        this.logger.debug(`주류 이미지 업로드 완료`);
      }
      // 주류 정보 업데이트
      alcohol.alcohol_name = alcohol_name || alcohol.alcohol_name; // 새로운 값이 제공되지 않았을 경우 이전 정보적용
      alcohol.alcohol_ename = alcohol_ename || alcohol.alcohol_ename;
      alcohol.alcohol_type = alcohol_type || alcohol.alcohol_type;
      alcohol.alcohol_class = alcohol_class || alcohol.alcohol_class;
      alcohol.alcohol_from = alcohol_from || alcohol.alcohol_from;
      alcohol.alcohol_percent = alcohol_percent || alcohol.alcohol_percent;
      alcohol.alcohol_manufacturer = alcohol_manufacturer || alcohol.alcohol_manufacturer;
      alcohol.alcohol_importer = alcohol_importer || alcohol.alcohol_importer;
      alcohol.alcohol_color = alcohol_color || alcohol.alcohol_color;
      alcohol.alcohol_woody = alcohol_woody || alcohol.alcohol_woody
      alcohol.alcohol_cereal = alcohol_cereal || alcohol.alcohol_cereal
      alcohol.alcohol_painty = alcohol_painty || alcohol.alcohol_painty
      alcohol.alcohol_floral = alcohol_floral || alcohol.alcohol_floral
      alcohol.alcohol_winy = alcohol_winy || alcohol.alcohol_winy
      alcohol.alcohol_pitty = alcohol_pitty || alcohol.alcohol_pitty
      alcohol.alcohol_sulper = alcohol_sulper || alcohol.alcohol_sulper
      alcohol.alcohol_fruity = alcohol_fruity || alcohol.alcohol_fruity
      alcohol.alcohol_info = alcohol_info || alcohol.alcohol_info;
      await queryRunner.manager.save(alcohol);
      await queryRunner.commitTransaction();
      return {message: `주류 정보 수정 완료`, data: alcohol, statusCode: 200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('주류 정보 수정 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
    }
  }

  // 등록된 주류 삭제
  async deleteAlcohol(alcohol_idx: number) {
    const queryRunner = this.alcoholRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_idx:alcohol_idx}});
      if (!alcohol) {
        return {message: `해당되는 주류는 없습니다. 입력된 주류번호 : ${alcohol_idx}`, data: null,statusCode: 404};
      }
      // SFTP서버에 등록된 이미지파일 삭제
      if (alcohol.alcohol_imgpath) {
        await this.sftpService.deleteFile(alcohol.alcohol_imgpath);
      }
      // 데이터베이스 내에 해당 항목 삭제
      await this.alcoholRepository.remove(alcohol);
      await queryRunner.commitTransaction();
      return {message: `주류 삭제 완료. 삭제된 주류번호 : [${alcohol_idx}]`, data: alcohol, statusCode: 200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('주류 삭제 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
    }
  }

  // 주간보틀 생성
  async setWeekBottle(createWeekBottleDto: CreateWeekbottleDto) {
    try {
      const {alcohol_idx} = createWeekBottleDto;
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_idx: alcohol_idx}});
      if (!alcohol) {
        return {message: `해당되는 주류는 없습니다. 입력된 주류번호 : ${alcohol_idx}`, data: null,statusCode: 404};
      }
      const previousWeekBottle = await this.weekbottleRepository.find();
      if (previousWeekBottle) {
        await this.weekbottleRepository.remove(previousWeekBottle);
        this.logger.log('기존의 WeekBottle 데이터가 삭제되었습니다.')
      }
      const weekbottle = new Weekbottle();
      weekbottle.alcohol_idx = alcohol.alcohol_idx;
      weekbottle.weekbottle_updatedate = null;
      await this.weekbottleRepository.save(weekbottle);
      return {message: `주간보틀 등록 완료. 등록된 주류번호 : [${alcohol_idx}]`, data: weekbottle, statusCode: 200};
    } catch (error) {
      this.logger.error('주간보틀 등록 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 주간보틀 홈화면
  async getWeekBottle() {
    try {
      const weekbottle = await this.weekbottleRepository.find();
      const bottleidx = weekbottle.map(item => item.alcohol_idx)[0];
      const alcohol = await this.alcoholRepository.findOne({
        where: {alcohol_idx: bottleidx},
        select: ['alcohol_idx', 'alcohol_imgpath', 'alcohol_name', 'alcohol_ename', 'alcohol_type', 'alcohol_class', 'alcohol_from', 'alcohol_percent', 'alcohol_manufacturer', 'alcohol_importer', 'alcohol_color', 'alcohol_woody', 'alcohol_cereal', 'alcohol_painty', 'alcohol_floral', 'alcohol_winy', 'alcohol_pitty', 'alcohol_sulper', 'alcohol_fruity', 'alcohol_info'],
      });
      return {message: `주간보틀(홈화면)`, data: alcohol, statusCode: 200};
    } catch (error) {
      this.logger.error('주간보틀 로드 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // async getMyPets(user_email: string) {
  //   try {
  //     if(!user_email) {
  //       this.logger.error('요청에서 user_email이 제공되지 않았습니다.');
  //       return {message:'요청에서 user_email이 제공되지 않았습니다.', statusCode:400};
  //     }
  //     const user = await this.userRepository.findOne({where:{user_email:user_email, user_status:'A'}});
  //     if(!user) {
  //       return {message:`해당 회원이 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
  //     }
  //     const dogs = await this.dogRepository.find({where:{user_email: user.user_email}});    // 회원테이블의 user_email에 해당하는 user_idx를 가져와서 강아지테이블의 user_idx에 대입하여 해당 정보 추출.
  //     return {message:`${user_email}님의 애완견정보`, data:dogs, statusCode:200};
  //   } catch (error) {
  //     this.logger.error('강아지정보 확인 중 오류 발생');
  //     this.logger.error(error);
  //     console.log(error);
  //     throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
  //   }
  // }
}
