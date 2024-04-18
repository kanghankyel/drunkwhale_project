import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReplyFriendDto {
    
    @ApiProperty({description:'술친구 메일답장'})
    @IsString()
    readonly friend_reply: string | null;

    @ApiProperty({description:'술친구 매칭결과 ( Y=매칭수락, N=매칭거절, W=매칭대기중 )'})
    @IsString()
    readonly friend_match: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}