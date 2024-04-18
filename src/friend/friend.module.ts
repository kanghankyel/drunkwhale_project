import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { WorldcupModule } from 'src/worldcup/worldcup.module';
import { friendRepository } from './friend.repository';

@Module({
  imports: [DatabaseModule, UserModule, WorldcupModule],
  controllers: [FriendController],
  providers: [...friendRepository, FriendService],
  exports: [...friendRepository],
})
export class FriendModule {}
