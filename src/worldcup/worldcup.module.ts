import { Module } from '@nestjs/common';
import { WorldcupService } from './worldcup.service';
import { WorldcupController } from './worldcup.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { worldcupRepository } from './worldcup.repository';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [WorldcupController],
  providers: [...worldcupRepository, WorldcupService],
})
export class WorldcupModule {}
