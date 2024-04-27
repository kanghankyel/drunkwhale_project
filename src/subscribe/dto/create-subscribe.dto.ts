import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateSubscribeDto {

    @ApiProperty({example:'주류이름', description:'주류_이름(FK)'})
    @IsString()
    readonly alcohol_name: string | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
