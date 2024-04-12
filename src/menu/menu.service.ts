import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MenuService {

  constructor (
    @Inject('MENU_REPOSITORY') private menuRepository: Repository<Menu>,
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {};

  private logger = new Logger('menu.service.ts');


  // 메뉴 상품등록 (카페)
  async createMenu(createMenuDto: CreateMenuDto, file: Express.Multer.File) {
    const queryRunner = this.menuRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {menu_name, menu_type, menu_info, menu_price, user_email} = createMenuDto;
      const store = await this.storeRepository.findOne({where:{user_email:user_email, store_status:'A'}});
      if(!store) {
        return {message:`해당하는 스토어가 없습니다. 입력된 회원 : ${user_email}`, statusCode:404};
      }
      const menu = new Menu();
      menu.menu_name = createMenuDto.menu_name;
      menu.menu_type = createMenuDto.menu_type;
      menu.menu_info = createMenuDto.menu_info;
      menu.menu_price = createMenuDto.menu_price;
      menu.menu_updatedate = null;
      menu.user_email = createMenuDto.user_email;
      // SFTP서버에 파일 upload
      if (file) {   // 이미지가 있을 경우에만 작동되게 하기
        if (!file.buffer) {
          this.logger.error(`파일 객체에 buffer 속성이 포함되어 있지 않습니다.`);
          throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
        }
        const fileExtension = file.originalname.split('.').pop();   // 파일이름과 확장자 분리. pop를 사용하여 배열 마지막 요소인 파일확장자를 가져옴
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;    // 파일 유니크명 생성
        const menu_image_name = `${file.originalname}`;    // 이미지 파일 정보 (원본파일명)
        const menu_image_key = `${uniqueFileName}`;    // 이미지 파일 정보 (유니크명)
        const menu_image_path = `uploads/drunkwhale/menu/${uniqueFileName}`;    // 이미지 파일 정보 (경로)
        menu.menu_imgname = menu_image_name;   // 이미지 파일 정보 데이터베이스에 입력
        menu.menu_imgkey = menu_image_key;
        menu.menu_imgpath = menu_image_path;
        const buffer = file.buffer;
        await this.sftpService.uploadFileFromBuffer(buffer, `uploads/drunkwhale/menu/${uniqueFileName}`);
        this.logger.debug(JSON.stringify(store.user_email) + ' 님의 메뉴정보 SFTP서버로 전송 완료');
      }
      // 3. 주류 정보 트랜잭션 저장. 기존 코드 변경. ( 기존코드 => await this.menuRepository.save(menu); )
      await queryRunner.manager.save(menu);
      this.logger.debug(JSON.stringify(store.user_email) + ' 님의 주류 정보입력 완료');
      // 4. 모든 작업이 성공하면 트랜잭션 커밋
      await queryRunner.commitTransaction();
      return {message:`${user_email}님의 주류 정보입력 완료`, data:menu, statusCode:200};
          // 기존 코드
          // if (file) {
          //   const menu_image_path: string = `uploads/${file.originalname}`;
          //   menu.menu_image = menu_image_path;
          //   const buffer = file.buffer;
          //   await this.sftpService.uploadFileFromBuffer(buffer, `uploads/${file.originalname}`);
          //   this.logger.debug(`[${user_email}] 님의 메뉴이미지가 SFTP서버로 전송 완료`);
          // }
          // await queryRunner.manager.save(menu);
          // await queryRunner.commitTransaction();
          // return {message:'메뉴등록이 완료되었습니다.', data:menu, statusCode:200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('메뉴등록 중 오류 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
    }
  }


}
