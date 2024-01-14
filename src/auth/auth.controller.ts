import { Body, Controller, Get, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@ApiTags('AUTH 모듈')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService, private userService: UserService) {}

    private logger = new Logger('auth.controller.ts');

    // 일반 로그인
    @ApiOperation({summary:'로그인', description:'로그인'})
    @Post('login')
    async loginUser(@Body() user: User, @Res() res) {
        this.logger.log(`클라이언트에서 전달 된 값 (아이디만) : ${user.user_id}`);
        console.log(user);
        const loginAuth: {message: string, data: string, statusCode: number} = await this.authService.loginUser(user);
        if (loginAuth.statusCode === 200) {     // 로그인 성공시 RefreshToken도 함께 발급
            this.authService.setRefreshToken(user, res);
        }
        return res.status(HttpStatus.OK).json(loginAuth);       // res.status()를 호출해서 200에 대한 내용 전달 + service단에서 만든 데이터를 JSON 형태도 전달
    }

    // 토큰 재발급
    @ApiOperation({summary:'토큰재발급', description:'토큰재발급'})
    @ApiBearerAuth()
    @Post('refresh')
    @UseGuards(AuthGuard('refresh'))
    async refresh(@Req() req, @Res({passthrough: true}) res) {
        try {
            const user = req.user;
            const accessToken = await this.authService.getAccessToken(user);
            const refreshToken = this.authService.setRefreshToken(user, res);
            res.cookie('refreshToken', refreshToken, {httpOnly: true});
            this.logger.debug(`RefreshToken 발급 성공 - 사용자 : ${user.user_id}`);
            return {accessToken};
        } catch (error) {
            this.logger.error(`RefreshToken 발급 중 오류 : ${error.message}`);
            return {error: 'RefreshToken 발급 중 오류가 발생했습니다.'};
        }
    }

    // 로그아웃
    @ApiOperation({summary:'로그아웃', description:'토큰삭제. 로그아웃'})
    @Post('logout')
    @UseGuards(AuthGuard('refresh'))
    logout(@Req() req, @Res() res) {
        this.logger.log(`${req.user.user_id} 가 로그아웃 되었습니다.`);
        res.clearCookie('refreshToken'); // 쿠키 삭제
        return res.send({result: '로그아웃완료'});
    }

    // OAuth 소셜로그인(구글) 입력창
    @ApiOperation({summary:'소셜로그인(구글)', description:'소셜로그인(구글)'})
    @Get('login/google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req, @Res() res) {
        // res.redirect('http://localhost:3000/auth/login/google/redirect');
        res.redirect('/auth/login/google/redirect');
    }

    // OAuth 소셜로그인 & 회원가입
    @ApiOperation({summary:'소셜로그인 리다이렉트', description:'소셜로그인 리다이렉트'})
    @Get('login/google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleRedirect(@Req() req, @Res() res) {
        const clientIP = req.ip;        // 회원 Ip정보 추가로 받기
        const user = await this.authService.oAuthLogin(req.user, clientIP);
        const hasInfo = await this.authService.checkUserInfo(user);     // 회원 서브정보 체크
        const token = this.authService.setRefreshToken(user, res);
        this.logger.log(`소셜로그인 정보 :  ${user.user_email}`);
        if(hasInfo) {
            // res.redirect('http://localhost:3000/');     // 서브정보가 있으면 localhost:3000/로 리다이렉트
            res.redirect('/');
        } else {
            // res.redirect(`http://localhost:3000/user/moreinfo/${user.user_id}`);        // 서브정보가 없으면 localhost:3000/user/moreinfo로 리다이렉트
            res.redirect(`/user/moreinfo/${user.user_id}`);
        }
    }

}
