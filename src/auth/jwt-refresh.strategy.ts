import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { jwtConfig } from "./auth.config";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

    private logger = new Logger('jwt-refresh.strategy.ts');

    constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) {
        super({
            jwtFromRequest: (req) => {      // RefreshToken는 jwtFromRequest에서 Header가 아닌 Request의 쿠키에서 JWT토큰을 가져온다
                const cookie = req.cookies['refreshToken'];
                return cookie;
            },
            ignoreExpiration: false,
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: any) {      // 검증 성공시 실행, 실패시 에러   * Passport는 validate에 성공할시 리턴값을 request.user에 저장
        this.logger.log(`PassportStrategy를 상속한 JwtRefreshStrategy의 validate(payload)를 호출. 매개변수로 들어온 값 : ${payload}`);
        const {user_id} = payload;
        const user: User = await this.userRepository.findOne({
            select: ['user_idx', 'user_id', 'user_phone', 'user_info', 'user_createdate'],
            where: {user_id : user_id}
        });
        if(!user) {
            throw new UnauthorizedException(`존재하지 않는 회원입니다. 입력한 ID : ${user_id}`);
        }
        return user;
    }

}


// auth.module에서 이 클래스를 사용하기 위해 Auth Module Providers항목에 넣기