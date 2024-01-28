import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Store } from 'src/store/entities/store.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MenuService {

  constructor (
    @Inject('MENU_REPOSITORY') private menuRepository: Repository<Menu>,
    @Inject('STORE_REPOSITORY') private storeRepository: Repository<Store>,
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
  ) {};

  private logger = new Logger('menu.service.ts');


  // 메뉴 상품등록
  async createMenu(createMenuDto: CreateMenuDto) {
    try {
      const {menu_image, menu_name, menu_info, menu_price, store_idx} = createMenuDto;
      const store = await this.storeRepository.findOne({where:{store_idx:store_idx, store_status:'A'}});
      if(!store) {
        return {message:`해당하는 스토어가 없습니다. 입력된 스토어 : ${store_idx}`, statusCode:404};
      }
      const menu = this.menuRepository.create({
        menu_image,
        menu_name,
        menu_info,
        menu_price,
        menu_updatedate: null,
        store_idx,
      });
      await this.menuRepository.save(menu);
      return {message:'메뉴등록이 완료되었습니다.', data:menu, statusCode:200};
    } catch (error) {
      this.logger.error('메뉴등록 중 오류 발생.');
      this.logger.error(`에러내용 : ${error}`);
      console.log(error);
      throw new InternalServerErrorException('서버 오류 발생. 다시 시도해 주세요.');
    }
  }

}
