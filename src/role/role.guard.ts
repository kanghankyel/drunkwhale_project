import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./role.decorator";
import { RoleEnum } from "./role.enum";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor (private reflector: Reflector) {}

    private logger = new Logger('role.guard.ts');

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if(!roles) {
            return true;        // 권한이 필요하지 않을 경우
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // 수정된 데이터 형식에서 역할을 확인
        const userRoles = Array.isArray(user.roles) ? user.roles : [];
        const hasRequiredRole = roles.some((role) => userRoles.includes(role));
        if(!hasRequiredRole) {
            this.logger.warn(`권한접근한 회원 : ${user.user_id}`);
            this.logger.warn(`접근된 회원권한 : ${JSON.stringify(user.roles)}`)
            this.logger.warn(`이 페이지에 허용된 접근가능 역할: ${JSON.stringify(roles)}`);
            throw new UnauthorizedException({message:'잘못된 권한 접근입니다.', error:'Unauthorized', statusCode:401});
        }

        return hasRequiredRole;
    }

}

// 1. reflector.getAllAndOverride 를 사용하여 @Roles 데코레이터에서 전달된 메타데이터를 가져온다.
// 2. requiredRoles 변수에 할당되며, 핸들러/클래스 순으로 오버라이딩 된다.
// 3. request 객체에서 현재 인증된 user 정보를 가져온다.
// 4. user의 roles 속성에서 requiredRoles와 겹치는 것이 있는지 체크한다.
// 5. 겹치는 권한이 있으면 통과, 없으면 접근 차단하는 로직이다.
// 공식문서 참조
// 기능하지 않아 어레인지 하였음.