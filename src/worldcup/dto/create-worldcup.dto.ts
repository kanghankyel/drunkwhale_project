import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateWorldcupDto {

    @ApiProperty({description:'주류월드컵_결과'})
    @IsString()
    readonly worldcup_result: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
