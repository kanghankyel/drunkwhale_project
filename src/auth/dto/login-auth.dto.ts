import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto {

    @ApiProperty({description:'회원 아이디'})
    @IsNotEmpty()
    @IsString()
    user_id: string;

    @ApiProperty({description:'회원 비밀번호'})
    @IsNotEmpty()
    @IsString()
    user_pw: string;

}