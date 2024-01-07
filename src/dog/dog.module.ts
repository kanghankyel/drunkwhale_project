import { Module } from '@nestjs/common';
import { DogService } from './dog.service';
import { DogController } from './dog.controller';
import { DatabaseModule } from 'src/database/database.module';
import { dogRepositroy } from './dog.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [DogController],
  providers: [...dogRepositroy, DogService]
})
export class DogModule {}
