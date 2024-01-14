import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { storeRepository } from './store.repository';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [StoreController],
  providers: [...storeRepository, StoreService],
})
export class StoreModule {}
