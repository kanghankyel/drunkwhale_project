import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { userRepository } from './user.repository';
import { RoleModule } from 'src/role/role.module';
import { RoleService } from 'src/role/role.service';

@Module({
  imports: [DatabaseModule, RoleModule],
  controllers: [UserController],
  providers: [...userRepository, UserService, RoleService],
  exports: [...userRepository, UserService],
})
export class UserModule {}
