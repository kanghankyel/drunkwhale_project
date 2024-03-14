import { Body, Controller, Get, HttpException, HttpStatus, Inject, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import axios from 'axios';
import { userRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';

@ApiTags('AUTH 모듈')
@Controller()
export class AuthController {

    constructor(
        private authService: AuthService,
        private userService: UserService,
        @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
        ) {}

    private logger = new Logger('auth.controller.ts');

    // 일반 로그인
    @ApiOperation({summary:'로그인', description:'로그인'})
    @Post('login')
    async loginUser(@Body() user: User, @Res() res) {
        this.logger.log(`클라이언트에서 전달 된 값 (아이디만) : ${user.user_email}`);
        const loginAuth: {message: string, data: string, statusCode: number} = await this.authService.loginUser(user, res);
        if (loginAuth.statusCode === 200) {     // 로그인 성공시 RefreshToken도 함께 발급
            this.authService.setRefreshToken(user, res);
        }
        return res.status(HttpStatus.OK).json(loginAuth);       // res.status()를 호출해서 200에 대한 내용 전달 + service단에서 만든 데이터를 JSON 형태도 전달
    }

    // 토큰 재발급
    @ApiOperation({summary:'토큰재발급', description:'토큰재발급'})
    @ApiBearerAuth()
    @Post('auth/refresh')
    @UseGuards(AuthGuard('refresh'))
    async refresh(@Req() req, @Res({passthrough: true}) res) {
        try {
            const user = req.user;
            // const user = req.user.user_email;
            const accessToken = await this.authService.getAccessToken(user);
            const refreshToken = this.authService.setRefreshToken(user, res);
            res.cookie('refreshToken', refreshToken, {httpOnly: true});
            this.logger.debug(`RefreshToken 발급 성공 - 사용자 : ${user.user_email}`);
            return {accessToken};
        } catch (error) {
            this.logger.error(`RefreshToken 발급 중 오류 : ${error.message}`);
            return {error: 'RefreshToken 발급 중 오류가 발생했습니다.'};
        }
    }

    // 로그아웃
    @ApiOperation({summary:'로그아웃', description:'토큰삭제. 로그아웃'})
    @Post('auth/logout')
    @UseGuards(AuthGuard('refresh'))
    logout(@Req() req, @Res() res) {
        this.logger.log(`${req.user.user_email} 가 로그아웃 되었습니다.`);
        res.clearCookie('refreshToken'); // 쿠키 삭제
        return res.send({result: '로그아웃완료'});
    }

    // 카카오 소셜로그인
    @ApiOperation({summary:'소셜로그인(카카오)', description:'카카오소셜로그인. 회원유무검사 및 정보전송'})
    @Post('api/user/social-login')
    async kakaoCode(@Body() userToken, @Res() res) {        // 프론트에서 인가받은 코드 백에서 확인.
        this.logger.log(`프론트에서 전송된 카카오로그인 시 제공되는 코드 : ${userToken.token}`);
        const code = userToken.token;
        try {
            // 카카오로그인 '토큰 받기' 로직
            const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
                params: {
                    grant_type: 'authorization_code',
                    client_id: '896180ed6d636ed7f1c4e27da1d4f9b0',
                    redirect_uri: 'http://localhost:3000/login-callback',
                    code,
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            // 400번오류 났을때 강제로 Exception일으켜서 로그인 안되게.
            const kakaoAccessToken = response.data.access_token;
            const kakaoRefreshToken = response.data.refresh_token;
            this.logger.log(`카카오 AccessToken: ${kakaoAccessToken}`);
            this.logger.log(`카카오 RefreshToken: ${kakaoRefreshToken}`);

            // 카카오 '사용자 정보 가져오기' 로직
            const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${kakaoAccessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            const kakaoName = userInfoResponse.data.kakao_account.name;
            const kakaoEmail = userInfoResponse.data.kakao_account.email;
            const kakaoPhone = userInfoResponse.data.kakao_account.phone_number;
            this.logger.log(`카카오코드애서 사용자 정보 추출 => {name:${kakaoName}, email:${kakaoEmail}, phone:${kakaoPhone}}`);
            
            // 카카오로그인한 회원이 데이터베이스 내에 있는지 검사
            const userCheckByEmail = await this.authService.checkUserEmail(kakaoEmail);
            if(userCheckByEmail) {
                this.logger.log(`이미 등록된 회원입니다. 입력된 카카오회원 : ${kakaoEmail}`);
                const user = await this.userRepository.findOne({where:{user_email: kakaoEmail}});
                const accessToken = await this.authService.getAccessToken(user);
                const refreshToken = await this.authService.setRefreshToken(user, res);
                this.logger.debug('카카오로그인 로직 후 발급하는 홈페이지 자체 accessToken : ', accessToken);
                this.logger.debug('카카오로그인 로직 후 발급하는 홈페이지 자체 refreshToken : ', refreshToken);
                res.header('Authorization', `Bearer ${accessToken}`);
                res.cookie('refreshToken', refreshToken, {httpOnly: true});     // ####### 현재 refreshToken값 출력 잘되고, 쿠키로 전송이 되지만 크롬에서 확인하면 refreshToken의 value가 undefined가 되어있음. 원인 알 수 없음.
                return res.status(200).json({data: accessToken});     // 해당 회원이 존재하면 프론트로 200코드 전송
            } else {
                this.logger.log(`등록되지 않은 회원입니다. 입력된 카카오회원 : ${kakaoEmail}`);
                return res.status(404).json({name:kakaoName, email:kakaoEmail, phone:kakaoPhone});      // 해당 회원이 존재하지 않으면 프론트로 404코드와 회원 정보 전송
            }
        } catch (error) {
            if(error.response && error.response.status === 400) {
                this.logger.error('카카오로그인 사용자 토큰 요청시 동일한 인가코드가 여러번 사용됨 : ', error);
                return res.status(400).json({message: '카카오로그인 사용자 토큰 요청시 동일한 인가코드가 여러번 사용되었습니다. 인가코드는 일회용으로 사용자 토큰 요청시 매번 새로운 인가코드를 발급받아 사용해주셔야 합니다. 사용자 토큰 요청마다 새로운 인가코드를 사용하시면 문제를 해결하실 수 있습니다.'})
            } else {
                this.logger.error('카카오로그인 중 서버 오류 발생 : ', error);
                return res.status(500).send('카카오로그인 중 서버 오류 발생');
            }
        }
    }

    // 순수 백엔드 카카오소셜로그인 로직. 현재는 프런트와 협의하에 사용하지 않음. (백엔드port:3000, 프론트엔드port:3001 기준)
    @ApiOperation({summary:'소셜로그인(카카오) 백엔드 전용. ###현재사용X', description:'카카오소셜로그인. 회원유무검사 및 정보전송'})
    @Get('login-callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoCallback(@Req() req, @Res() res) {
        const kakaoProfile = req.user?.profile;
        this.logger.debug('auth.controller.ts에서 보여주는 kakaoProfile')
        console.log(kakaoProfile);
    }

    // 순수 백엔드 구글소셜로그인 로직. 현재는 프런트와 협의하에 사용하지 않음. (백엔드port:3000 기준 = 구글 Redirect URL)
    // 포트 3001번인지 3000인지 확인하고 redirect url도 동일한지 확인.
    // OAuth 소셜로그인(구글) 입력창
    @ApiOperation({summary:'소셜로그인(구글) 백엔드 전용. ###현재사용X', description:'소셜로그인(구글)'})
    @Get('login/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req, @Res() res) {
        res.redirect('http://localhost:3000/auth/login/google/redirect');
    }

    // 순수 백엔드 소셜로그인 로직. 현재는 프런트와 협의하에 사용하지 않음. (백엔드port:3000 기준 = Redirect URL)
    // OAuth 소셜로그인 & 회원가입
    @ApiOperation({summary:'소셜로그인 리다이렉트. 백엔드 전용. ###현재사용X', description:'소셜로그인 리다이렉트'})
    @Get('login/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req, @Res() res) {
        const clientIP = req.ip;        // 회원 Ip정보 추가로 받기
        const user = await this.authService.oAuthLogin(req.user, clientIP);
        const hasInfo = await this.authService.checkUserInfo(user);     // 회원 서브정보 체크
        const token = this.authService.setRefreshToken(user, res);
        this.logger.log(`소셜로그인 정보 :  ${user.user_email}`);
        if(hasInfo) {
            res.redirect('http://localhost:3000/');     // 서브정보가 있으면 localhost:3000/로 리다이렉트
        } else {
            res.redirect(`http://localhost:3000/user/moreinfo/${user.user_email}`);        // 서브정보가 없으면 localhost:3000/user/moreinfo로 리다이렉트
        }
    }

}
