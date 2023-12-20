import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "./role.enum";

export const ROLES_KEY = 'roles';

export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);       // SetMetadata를 이용하여 메타데이터로 Role 정보를 전달

// Roles 데코레이터로 허용할 Role 목록을 파라미터로 전달