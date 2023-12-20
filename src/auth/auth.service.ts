import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { OauthCreateuserDto } from './dto/oauth-createuser.dto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class AuthService {

    constructor(
        @Inject('USER_REPOSITORY') private userRepository: Repository<User>, 
        @Inject('ROLE_REPOSITORY') private roleRepository: Repository<Role>,
        private jwtService: JwtService, 
        private userService: UserService,
        private roleService: RoleService,
        ) {};

    private logger = new Logger('auth.service.ts');

    // 로그인
    async loginUser(user: User): Promise<{message: string, data: string, statusCode: number}> {     // Promise<많은 변수>로 Method 반환
        const {user_id, user_pw} = user;
        try {
            const findUser = await this.userRepository.findOne({select:['user_id', 'user_pw'], where:{user_id:user_id}});       // select통해 해당 값만 가져오고 where로 user_id 검색
            if(findUser && (await bcrypt.compare(user_pw, findUser.user_pw))) {     // 해당하는 값이 있는지 검사
                const payload = {user_id};      // payload 상수형 변수에 id값을 넣어줌
                const accessToken = await this.jwtService.sign(payload, {expiresIn: '1h'});        // payload 변수 값을 보내 전자 서명이 이루어지게 하고, 이를 accessToken 상수형 변수에 넣어줌
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

    // 소셜 회원가입 & 로그인
    async oAuthLogin(profile, clientIP) {
        this.logger.debug(profile);
        this.logger.debug(profile.user_email);
        const user = await this.userRepository.findOne({where:{user_email: profile.user_email}});
        if(!user) {     // 일치하는 회원없을 시 회원가입 진행
            const newUser = await this.userRepository.create({
                user_id: 'google_' + profile.user_id,
                user_name: profile.user_name,
                user_email: profile.user_email,
                user_ip: clientIP,
            });
            await this.userRepository.save(newUser);
            await this.roleService.createDefaultRole(newUser);      // 기본 권한 지급
            return newUser;
        }
        return user;
    }

    // AccessToken 발급
    async getAccessToken(user: User) {
        const {user_id, roles} = user;
        const payload = {user_id, roles};
        const accessToken = this.jwtService.sign(payload, {expiresIn: '1h'});
        return accessToken;
    }

    // RefreshToken 발급
    async setRefreshToken(user: User, res) {
        const {user_id, roles} = user;
        const payload = {user_id, roles};
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '30d'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        return refreshToken;
    }

    // 소설로그인 RefreshToken 발급
    async setOAuthRefreshToken(oAuthCreateuserDto: OauthCreateuserDto, res) {
        const {user_email} = oAuthCreateuserDto;
        const payload = {user_email};
        const refreshToken = this.jwtService.sign(payload, {expiresIn: '30d'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true});
        return refreshToken;
    }

    // async kakaoLogin({req, res}) {
    //     let user = await this.userService.findOneUserGoogle(req.user.user_email);
    //     if(!user) user = await this.userService.createUser({...req.user});
    //     const refreshToken = this.jwtService.sign(
    //         {email: user.user_email},
    //         {secret: process.env.REFRESH_TOKEN_SECRET_KEY, expiresIn: '30d'}
    //     );
    //     res.setHeader('Set-cookie', `refreshToken=${refreshToken}`);
    //     res.redirect('http://localhost:3000/kakao-callback');
    // }

}
