import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SetFriendDto {

    @ApiProperty({description:'술친구_회원이메일'})
    @IsString()
    readonly user_email: string | null;

}
