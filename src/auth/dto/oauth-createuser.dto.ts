import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class OauthCreateuserDto {

    @ApiProperty({description:'회원 이름'})
    @IsNotEmpty()
    @IsString()
    user_name: string;

    @ApiProperty({description:'회원 이메일'})
    @IsString()
    user_email: string;

}