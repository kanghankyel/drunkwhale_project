import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RolesGuard } from './role.guard';
import { roleRepository } from './role.repository';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { userRepository } from 'src/user/user.repository';

@Module({
  imports: [DatabaseModule],
  providers: [...roleRepository, RoleService, RolesGuard, UserService, ...userRepository],
  exports: [...roleRepository, RoleService, RolesGuard, UserService, ...userRepository]
})
export class RoleModule {}