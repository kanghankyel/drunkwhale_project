import { Body, Controller, HttpStatus, Logger, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('로그인')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    private logger = new Logger('auth.controller.ts');

    // 로그인
    @Post('login')
    async loginUser(@Body() loginAuthDto: LoginAuthDto, @Res() res) {
        this.logger.log('클라이언트에서 전달 된 값 : ', loginAuthDto);
        const loginAuth: {message: string, data: string, statusCode: number} = await this.authService.loginUser(loginAuthDto);
        return res.status(HttpStatus.OK).json(loginAuth);       // res.status()를 호출해서 200에 대한 내용 전달 + service단에서 만든 데이터를 JSON 형태도 전달
    }

    @Post('test')
    @UseGuards(JwtAuthGuard)
    test(@Res() req) {
        console.log('요청값 확인 : ', req);
    }

}
