import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { DatabaseModule } from 'src/database/database.module';
import { StoreModule } from 'src/store/store.module';
import { menuRepository } from './menu.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, StoreModule, UserModule],
  controllers: [MenuController],
  providers: [...menuRepository, MenuService],
  exports: [...menuRepository, MenuService],
})
export class MenuModule {}
