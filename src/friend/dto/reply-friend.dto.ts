import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReplyFriendDto {
    
    @ApiProperty({example:'거절하겠습니다.', description:'술친구 메일답장'})
    @IsString()
    readonly friend_reply: string | null;

    @ApiProperty({example:'N', description:'술친구 매칭결과 ( Y=매칭수락, N=매칭거절 )'})
    @IsString()
    readonly friend_match: string | null;

    @ApiProperty({example:'test9876@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}