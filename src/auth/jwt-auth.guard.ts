import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    // AuthGuard 클래스 커스텀 및 확장로직은 여기에 구현

}