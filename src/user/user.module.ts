import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userRepository } from './user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...userRepository, UserService],
  exports: [...userRepository, UserService],
})
export class UserModule {}
