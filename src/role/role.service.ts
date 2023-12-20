import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RoleEnum } from './role.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoleService {

    constructor(@Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>) {}

    // 회원생성시 생성되는 기본권한 (ROLE_USER)
    async createDefaultRole(user: User) {
        const defaultRole = this.roleRepository.create({
            role_type: RoleEnum.ROLE_USER,
            user
        });
        await this.roleRepository.save(defaultRole);
        return defaultRole;
    }

}
