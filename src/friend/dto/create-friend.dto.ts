import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateFriendDto {

    @ApiProperty({example:'test9876@test.com', description:'술친구 친구이메일'})
    @IsString()
    readonly friend_email: string | null;

    @ApiProperty({example:'술친구 하실래요?', description:'술친구 메일내용'})
    @IsString()
    readonly friend_text: string | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}