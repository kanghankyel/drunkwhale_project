import { Module } from '@nestjs/common';
import { AlcoholService } from './alcohol.service';
import { AlcoholController } from './alcohol.controller';
import { DatabaseModule } from 'src/database/database.module';
import { alcoholRepositroy } from './alcohol.repository';
import { UserModule } from 'src/user/user.module';
import { SftpModule } from 'src/sftp/sftp.module';
import { SftpService } from 'src/sftp/sftp.service';

@Module({
  imports: [DatabaseModule, UserModule, SftpModule],
  controllers: [AlcoholController],
  providers: [...alcoholRepositroy, AlcoholService, SftpService]
})
export class AlcoholModule {}
