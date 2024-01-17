import { Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";

// 현재는 쓰이지 않는 파일
// Google Strategy 사용
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {

    private logger = new Logger('jwt-oauth-google.strategy.ts');

    constructor() {     // constructor에서 성공하면 아래의 validate로 넘겨주고, 실패하면 멈춰지고 에러 반환
        super({     // 자식의 constructor를 부모의 constructor에 넘기는 방법은 super 사용
            // clientID: process.env.GOOGLE_AUTH_CLIENT,       // userID
            // clientSecret: process.env.GOOGLE_AUTH_SECRET,       //userpw
            clientID: '72003684736-d8fck909lr3s5s8hmo9qdramtlvnf4k2.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3001/login/google/redirect',     // 성공시 URL
            scope: ['email', 'profile'],        // 성공시 받을 데이터
        });
    }

    async validate(accessToken, refreshToken, profile: Profile) {      // 인증결과를 받는 부분
        if(!profile.emails){
            this.logger.error(`해당 profile의 email이 없습니다.`);
        }
        this.logger.debug('googleStrategy 로직');
        console.log(profile);
        return {
            user_id: profile.id,
            user_name: profile.displayName,
            user_email: profile.emails[0].value
        };
    }
}