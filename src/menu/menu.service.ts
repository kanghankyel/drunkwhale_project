import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';
import { v4 as uuidv4 } from 'uuid';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {

  constructor (
    @Inject('MENU_REPOSITORY') private menuRepository: Repository<Menu>,
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private readonly sftpService: SftpService,
  ) {};

  private logger = new Logger('menu.service.ts');


  // 메뉴 상품등록
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
      menu.store_idx = store.store_idx;
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

  // 등록된 전체 메뉴 정보보기
  async getAllMenu(page: number = 1) {
    try {
      const take = 10;
      const [menus, total] = await this.menuRepository.findAndCount({
        select: ['menu_idx', 'menu_name', 'menu_imgpath', 'menu_type', 'store_idx'],
        take,
        skip: page<=0 ? page=0 : (page-1)*take,
        order: {menu_idx: 'DESC'},
      });
      const lastPage = Math.ceil(total / take);
      if (lastPage >= page) {
        return {
          data: menus,
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
      this.logger.error('등록된 전체 메뉴 정보 확인 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 특정 스토어 메뉴 정보보기
  async getMenu(store_idx: number) {
    try {
      const store = await this.storeRepository.findOne({where:{store_idx: store_idx, store_status: 'A'}});
      if (!store) {
        return {message: `해당하는 스토어가 없거나 허가되지 않은 스토어입니다. 입력된 스토어번호 : [${store_idx}]`, data: null, statusCode: 404};
      }
      const user = store.user_email;
      const menus = await this.menuRepository.find({
        select: ['menu_idx', 'menu_name', 'menu_imgpath', 'menu_type', 'menu_price', 'menu_info', 'store_idx'],
        where: {user_email:user}
      });
      // 메뉴를 종류별로 분류
      const categoriMenus = {};
      menus.forEach(menu => {
        if (!categoriMenus[menu.menu_type]) {   // 메뉴 종류별로 객체를 생성하고, 해당 메뉴 종류에 해당하는 배열이 없으면 새로 생성
          categoriMenus[menu.menu_type] = [];
        }
        categoriMenus[menu.menu_type].push(menu);   // 해당 메뉴 종류에 해당하는 배열에 메뉴를 추가
      });
      // 메뉴를 종류별로 정렬
      const sortMenus = {};
      Object.keys(categoriMenus).forEach(menuType => {
        sortMenus[menuType] = categoriMenus[menuType].sort((a, b) => {    // 각 메뉴 종류에 해당하는 배열을 가져와서 정렬
          const menuTypeOrder = ['시그니처', '주류', '음식'];   // 정렬 순서를 정의한 배열을 기준으로 정렬
          return menuTypeOrder.indexOf(a.menu_type) - menuTypeOrder.indexOf(b.menu_type);
        });
      });
      return {message: `[${store_idx}] ${user}님의 스토어 메뉴`, data: sortMenus, statusCode: 200};
    } catch (error) {
      this.logger.error('특정 스토어 메뉴 정보 확인 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

  // 메뉴 상품수정
  async updateMenu(updateMenuDto: UpdateMenuDto, file: Express.Multer.File) {
    const queryRunner = this.menuRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {menu_idx, menu_name, menu_type, menu_info, menu_price, user_email} = updateMenuDto;
      let previousImgPath: string | undefined;    // 이전 이미지 경로를 저장할 변수 선언
      const menu = await this.menuRepository.findOne({where:{menu_idx:menu_idx}});
      if (!menu) {
        return {message: `해당되는 메뉴는 없습니다. 입력된 메뉴번호 : [${menu_idx}]`, data: null,statusCode: 404};
      }
      // 이미지 파일 업로드 로직
      if (file) {
        if (!file.buffer) {
          throw new Error('유효한 파일 객체가 전달되지 않았습니다.');
        }
        const fileExtension = file.originalname.split('.').pop();
        const uniqueFileName = `${uuidv4()}.${fileExtension}`;
        const menu_image_name = `${file.originalname}`;
        const menu_image_key = `${uniqueFileName}`;
        const menu_image_path = `uploads/drunkwhale/menu/${uniqueFileName}`;
        const buffer = file.buffer;
        // 이전 이미지 경로 저장
        previousImgPath = menu.menu_imgpath;
        this.logger.debug(`기존의 사진 파일 경로 : [${previousImgPath}]`);
        // 이전 이미지 삭제
        if (previousImgPath) {
          await this.sftpService.deleteFile(previousImgPath);
        }
        // 새로운 이미지 업로드
        await this.sftpService.uploadFileFromBuffer(buffer, menu_image_path);
        // 메뉴 객체에 새로운 이미지 정보 할당
        menu.menu_imgname = menu_image_name;
        menu.menu_imgkey = menu_image_key;
        menu.menu_imgpath = menu_image_path;
        this.logger.debug(`${user_email} 님의 메뉴 이미지 업로드 완료`);
      }
      // 메뉴 정보 업데이트
      menu.menu_name = menu_name || menu.menu_name;
      menu.menu_type = menu_type || menu.menu_type;
      menu.menu_info = menu_info || menu.menu_info;
      menu.menu_price = menu_price || menu.menu_price;
      await queryRunner.manager.save(menu);
      await queryRunner.commitTransaction();
      return {message: `[${user_email}]님의 메뉴 정보 수정 완료`, data: menu, statusCode: 200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('메뉴 정보 수정 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
    }
  }

  // 등록된 메뉴 삭제
  async deleteMenu(menu_idx: number) {
    const queryRunner = this.menuRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const menu = await this.menuRepository.findOne({where:{menu_idx: menu_idx}});
      if (!menu) {
        return {message: `해당되는 메뉴는 없습니다. 입력된 메뉴번호 : [${menu_idx}]`, data: null,statusCode: 404};
      }
      // SFTP서버에 등록된 이미지파일 삭제
      if (menu.menu_imgpath) {
        await this.sftpService.deleteFile(menu.menu_imgpath);
      }
      // 데이터베이스 내에 해당 항목 삭제
      await this.menuRepository.remove(menu);
      await queryRunner.commitTransaction();
      return {message: `주류 삭제 완료. 삭제된 주류번호 : [${menu_idx}]`, data: menu, statusCode: 200};
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('메뉴 삭제 중 오류 발생');
      this.logger.error(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    } finally {
      await queryRunner.release();
    }
  }

}
