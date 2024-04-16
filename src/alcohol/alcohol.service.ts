import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlcoholDto } from './dto/create-alcohol.dto';
import { Alcohol } from './entities/alcohol.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateAlcoholDto } from './dto/update-alcohol.dto';

@Injectable()
export class AlcoholService {
  constructor(
    @Inject('ALCOHOL_REPOSITORY')
    private alcoholRepository: Repository<Alcohol>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {}

  private logger = new Logger('alcohol.service.ts');

  // 주류 정보입력(관리자)
  async createAlcohol(
    createAlcoholDto: CreateAlcoholDto,
    file: Express.Multer.File,
  ) {
    // 1. 데이터베이스 트랜잭션을 관리하기 위한 QueryRunner 생성
    const queryRunner =
      this.alcoholRepository.manager.connection.createQueryRunner();
    // 2. QueryRunner 연결 및 트랜잭션 시작
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        alcohol_name,
        alcohol_type,
        alcohol_class,
        alcohol_from,
        alcohol_percent,
        alcohol_color,
        alcohol_aroma,
        alcohol_flavor,
        alcohol_info,
        user_email,
      } = createAlcoholDto;
      const user = await this.userRepository.findOne({
        where: { user_email: user_email, user_status: 'A' },
      });
      if (!user) {
        return {
          message: `해당 회원이 없습니다. 입력된 회원 : ${user_email}`,
          statusCode: 404,
        };
      }
      const alcohol = new Alcohol();
      alcohol.alcohol_name = createAlcoholDto.alcohol_name;
      alcohol.alcohol_type = createAlcoholDto.alcohol_type;
      alcohol.alcohol_class = createAlcoholDto.alcohol_class;
      alcohol.alcohol_from = createAlcoholDto.alcohol_from;
      alcohol.alcohol_percent = createAlcoholDto.alcohol_percent;
      alcohol.alcohol_color = createAlcoholDto.alcohol_color;
      alcohol.alcohol_aroma = createAlcoholDto.alcohol_aroma;
      alcohol.alcohol_flavor = createAlcoholDto.alcohol_flavor;
      alcohol.alcohol_info = createAlcoholDto.alcohol_info;
      alcohol.alcohol_updatedate = null;
      alcohol.user_email = user.user_email;
      // SFTP서버에 파일 upload
      if (file) {
        // 이미지가 있을 경우에만 작동되게 하기
        console.log(file);
        if (!file.buffer) {
          this.logger.error(
            `파일 객체에 buffer 속성이 포함되어 있지 않습니다.`,
          );
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
        await this.sftpService.uploadFileFromBuffer(
          buffer,
          `uploads/drunkwhale/alcohol/${uniqueFileName}`,
        );
        this.logger.debug(
          JSON.stringify(user.user_email) +
            ' 님의 주류정보 SFTP서버로 전송 완료',
        );
      }
      // 3. 주류 정보 트랜잭션 저장. 기존 코드 변경. ( 기존코드 => await this.alcoholRepository.save(alcohol); )
      await queryRunner.manager.save(alcohol);
      this.logger.debug(
        JSON.stringify(user.user_email) + ' 님의 주류 정보입력 완료',
      );
      // 4. 모든 작업이 성공하면 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return {
        message: `${user_email}님의 주류 정보입력 완료`,
        data: alcohol,
        statusCode: 200,
      };
    } catch (error) {
      // 5. 오류 발생 시 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      if (error.message === 'SFTP 연결 실패.') {
        return {
          message: 'SFTP 연결 실패로 데이터베이스에 저장 실패하였습니다.',
          statusCode: 500,
        };
      } else {
        this.logger.error('주류정보 등록 중 오류 발생');
        this.logger.error(error);
        console.log(error);
        return {
          message: `서버 오류 발생. 다시 시도해 주세요.`,
          error: `${error}`,
          statusCode: 500,
        };
      }
    } finally {
      // 6. QueryRunner 자원 해제
      await queryRunner.release();
    }
  }

  // 등록된 주류 정보보기
  async getReadAlcohol() {
    try {
      const alcohols = await this.alcoholRepository.find();
      return { message: `등록된 주류 정보`, data: alcohols, statusCode: 200 };
    } catch (error) {
      this.logger.error('등록된 주류 정보 확인 중 오류 발생');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException(
        '서버 오류 발생. 다시 시도해 주세요.',
      );
    }
  }

  // 주류 정보수정
  async updateAlcohol(updateAlcoholDto: UpdateAlcoholDto, file: Express.Multer.File,) {
    const queryRunner = this.alcoholRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {alcohol_idx, alcohol_name, alcohol_type, alcohol_class, alcohol_from, alcohol_percent, alcohol_color, alcohol_aroma, alcohol_flavor, alcohol_info, user_email} = updateAlcoholDto;
      // 이전 이미지 경로를 저장할 변수 선언
      let previousImgPath: string | undefined;
      // 주류 객체 조회
      const alcohol = await this.alcoholRepository.findOne({where:{alcohol_idx: alcohol_idx}});
      if (!alcohol) {
        return {message: `해당되는 주류는 없습니다. 입력된 주류번호 : ${alcohol_idx}`, data: null,statusCode: 404};
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
        this.logger.debug(`${user_email} 님의 주류 이미지 업로드 완료`);
      }
      // 주류 정보 업데이트
      alcohol.alcohol_name = alcohol_name || alcohol.alcohol_name; // 새로운 값이 제공되지 않았을 경우 이전 정보적용
      alcohol.alcohol_type = alcohol_type || alcohol.alcohol_type;
      alcohol.alcohol_class = alcohol_class || alcohol.alcohol_class;
      alcohol.alcohol_from = alcohol_from || alcohol.alcohol_from;
      alcohol.alcohol_percent = alcohol_percent || alcohol.alcohol_percent;
      alcohol.alcohol_color = alcohol_color || alcohol.alcohol_color;
      alcohol.alcohol_aroma = alcohol_aroma || alcohol.alcohol_aroma;
      alcohol.alcohol_flavor = alcohol_flavor || alcohol.alcohol_flavor;
      alcohol.alcohol_info = alcohol_info || alcohol.alcohol_info;
      await queryRunner.manager.save(alcohol);
      await queryRunner.commitTransaction();
      return {message: `${user_email}님의 주류 정보 수정 완료`, data: alcohol, statusCode: 200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('주류 정보 수정 중 오류 발생');
      this.logger.error(error);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
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
