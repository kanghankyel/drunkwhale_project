import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { storeRepository } from './store.repository';
import { SftpModule } from 'src/sftp/sftp.module';
import { SftpService } from 'src/sftp/sftp.service';
import { subimgRepository } from './subimg.repository';
import { menuRepository } from 'src/menu/menu.repository';

@Module({
  imports: [DatabaseModule, UserModule, SftpModule],
  controllers: [StoreController],
  providers: [...storeRepository, ...subimgRepository, ...menuRepository, StoreService],
  exports: [...storeRepository, ...subimgRepository, ...menuRepository, StoreService],
})
export class StoreModule {}
