import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { DatabaseModule } from 'src/database/database.module';
import { dogRepositroy } from './dog.repository';
import { UserModule } from 'src/user/user.module';
import { SftpModule } from 'src/sftp/sftp.module';
import { SftpService } from 'src/sftp/sftp.service';

@Module({
  imports: [DatabaseModule, UserModule, SftpModule],
  controllers: [DogController],
  providers: [...dogRepositroy, DogService, SftpService]
})
export class DogModule {}
