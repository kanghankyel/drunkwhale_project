import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginUserDto {

    @ApiProperty({example: 'test1234@test.com', description:'회원 이름'})
    @IsString()
    user_email: string;

    @ApiProperty({example: 'test1234', description:'회원 이메일'})
    @IsString()
    user_pw: string;

}