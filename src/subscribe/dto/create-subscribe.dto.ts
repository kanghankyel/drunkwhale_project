import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSubscribeDto {

    @ApiProperty({example:'1', description:'주류_고유번호(FK)'})
    @IsString()
    readonly alcohol_idx: number | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
