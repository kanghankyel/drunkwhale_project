import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFriendDto {

    @ApiProperty({description:'술친구 친구이메일'})
    @IsString()
    readonly friend_email: string | null;

    @ApiProperty({description:'술친구 메일내용'})
    @IsString()
    readonly friend_text: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}