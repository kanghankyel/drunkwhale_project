import { Inject, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConfig } from "./auth.config";
import { Repository } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Injectable()       // JwtStrategy Class를 다른 곳에서 DI(Depoendency Injection)를 통해 이용할 수 있게 구성
export class JwtAccessStrategy extends PassportStrategy(Strategy) {

    private logger = new Logger('jwt-access.strategy.ts');

    constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>) {      // PassportStrategy를 상속한 JwtStrategy의 생성자 UserRepository를 호출
        super({     // JWT를 가져온 뒤 secret를 이용해서 유효한 값인지 검증하는 구성
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),       // Request Header에서 Bearer auth 뽑아내기
            ignoreEpiration: false,
            secretOrKey: jwtConfig.secret,
        });
    }

    async validate(payload: any) {      // Token이 유효하면 payload에 있는 회원아이디가 데이터베이스에 존재하는지 확인하고, 회원 객채를 반환해 주는 로직
        this.logger.log(`PassportStrategy를 상속한 JwtStrategy의 validate(payload)를 호출. 매개변수로 들어온 값 : ${payload}`);
        const {user_id} = payload;      // Client에서 전달된 JWT Payload에서 회원 아이디를 추출
        const user: User = await this.userRepository.findOne({
            select: ['user_idx', 'user_id', 'user_phone', 'user_info', 'user_createdate'],      // 보여줄 데이터만 추출
            where: {user_id : user_id}      // 조건
        });
        if(!user) {     // 존재하는 아이디인지 검사
            throw new UnauthorizedException(`존재하지 않는 회원입니다. 입력한 ID : ${user_id}`);
        }
        return user;
    }

}

// auth.module에서 이 클래스를 사용하기 위해 Auth Module Providers항목에 넣기