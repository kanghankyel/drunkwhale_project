import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { SftpService } from 'src/sftp/sftp.service';

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
      const {menu_name, menu_info, menu_price, user_email} = createMenuDto;
      const store = await this.storeRepository.findOne({where:{user_email:user_email, store_status:'A'}});
      if(!store) {
        return {message:`해당하는 스토어가 없습니다. 입력된 스토어 : ${user_email}`, statusCode:404};
      }
      const menu = new Menu();
      menu.menu_name = createMenuDto.menu_name;
      menu.menu_info = createMenuDto.menu_info;
      menu.menu_price = createMenuDto.menu_price;
      menu.menu_updatedate = null;
      menu.user_email = createMenuDto.user_email;
      if (file) {
        const menu_image_path: string = `uploads/${file.originalname}`;
        menu.menu_image = menu_image_path;
        const buffer = file.buffer;
        await this.sftpService.uploadFileFromBuffer(buffer, `uploads/${file.originalname}`);
        this.logger.debug(`[${user_email}] 님의 메뉴이미지가 SFTP서버로 전송 완료`);
      }
      await queryRunner.manager.save(menu);
      await queryRunner.commitTransaction();
      return {message:'메뉴등록이 완료되었습니다.', data:menu, statusCode:200};
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
