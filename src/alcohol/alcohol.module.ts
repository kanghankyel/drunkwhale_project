import { Module } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { AlcoholController } from './alcohol.controller';
import { DatabaseModule } from 'src/database/database.module';
import { alcoholRepositroy } from './alcohol.repository';
import { UserModule } from 'src/user/user.module';
import { SftpModule } from 'src/sftp/sftp.module';
import { SftpService } from 'src/sftp/sftp.service';
import { weekbottleRepository } from './weekbottle.repository';

@Module({
  imports: [DatabaseModule, UserModule, SftpModule],
  controllers: [AlcoholController],
  providers: [...alcoholRepositroy, ...weekbottleRepository, AlcoholService, SftpService],
  exports: [...alcoholRepositroy, ...weekbottleRepository],
})
export class AlcoholModule {}
