import { Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-kakao";
import { Request } from "express";
import axios from "axios";

// 현재는 쓰이지 않는 파일
// Kakao Strategy 사용
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {

    private logger = new Logger('jwt-oauth-kakao.strategy.ts');

    constructor() {
        super({
            clientID: '896180ed6d636ed7f1c4e27da1d4f9b0',
            callbackURL: 'http://localhost:3000/login-callback',
            // tokenURL: 'https://kauth.kakao.com/oauth/token',
            // scope: ['name', 'account_email'],
        });
    }

    async validate(accessToken, refreshToken, profile: Profile, req: Request) {
        this.logger.debug('kakaoStrategy 로직');
        console.log(profile);
        this.logger.debug('kakao accessToken');
        console.log(accessToken);
        this.logger.debug('kakao refreshToken');
        console.log(refreshToken);
        return {
            profile
        };
    }

}