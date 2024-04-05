import { Module } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { AlcoholModule } from 'src/alcohol/alcohol.module';
import { subscribeRepository } from './subscribe.repository';

@Module({
  imports: [DatabaseModule, UserModule, AlcoholModule],
  controllers: [SubscribeController],
  providers: [...subscribeRepository, SubscribeService],
})
export class SubscribeModule {}
