import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateWorldcupDto {

    @ApiProperty({example:'1,2,3,4', description:'주류월드컵_결과'})
    @IsString()
    readonly worldcup_result: string | null;

    @ApiProperty({example:'test1234@test.com', description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
