import { Module } from '@nestjs/common';
import { CabinetService } from './cabinet.service';
import { CabinetController } from './cabinet.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { AlcoholModule } from 'src/alcohol/alcohol.module';
import { cabinetRepositroy } from './cabinet.repository';

@Module({
  imports: [DatabaseModule, UserModule, AlcoholModule],
  controllers: [CabinetController],
  providers: [...cabinetRepositroy, CabinetService],
})
export class CabinetModule {}
