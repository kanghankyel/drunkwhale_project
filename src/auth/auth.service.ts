import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(@Inject('USER_REPOSITORY') private userRepository: Repository<User>, private jwtService: JwtService) {};

    private logger = new Logger('auth.service.ts');

    // 로그인
    async loginUser(loginAuthDto: LoginAuthDto): Promise<{message: string, data: string, statusCode: number}> {     // Promise<많은 변수>로 Method 반환
        const {user_id, user_pw} = loginAuthDto;
        try {
            const findUser = await this.userRepository.findOne({select:['user_id', 'user_pw'], where:{user_id:user_id}});       // select통해 해당 값만 가져오고 where로 user_id 검색
            if(findUser && (await bcrypt.compare(user_pw, findUser.user_pw))) {     // 해당하는 값이 있는지 검사
                const payload = {user_id};      // payload 상수형 변수에 id값을 넣어줌
                const accessToken = await this.jwtService.sign(payload, {expiresIn: '60s'});        // payload 변수 값을 보내 전자 서명이 이루어지게 하고, 이를 accessToken 상수형 변수에 넣어줌
                return {message: `로그인 성공`, data: accessToken, statusCode: 200};
            } else {
                this.logger.log('로그인에 실패하였습니다.');
                return {message: `로그인 실패`, data: null, statusCode: 400};
            }
        } catch (error) {
            this.logger.log('login 처리과정 중 문제 발생');
            this.logger.error(`에러내용 : ${error}`);
            throw new InternalServerErrorException('로그인 시도중 문제 발생');
        }
    }

    // RefreshToken 발급
    async setRefreshToken(loginAuthDto: LoginAuthDto, res) {
        const {user_id, user_pw} = loginAuthDto;
        const payload = {user_id};
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '2w'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        return;
    }

}
