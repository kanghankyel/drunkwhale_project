import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateCabinetDto {

    @ApiProperty({description:'주류_이름(FK)'})
    @IsString()
    readonly alcohol_name: string | null;

    @ApiProperty({description:'술장고_평가(맛)'})
    @IsString()
    readonly cabinet_flavor: string | null;

    @ApiProperty({description:'술장고_평가(향)'})
    @IsString()
    readonly cabinet_aroma: string | null;

    @ApiProperty({description:'술장고_평가(외형)'})
    @IsString()
    readonly cabinet_look: string | null;

    @ApiProperty({description:'술장고_평가(품질)'})
    @IsString()
    readonly cabinet_quality: string | null;

    @ApiProperty({description:'술장고_평가(균형)'})
    @IsString()
    readonly cabinet_balance: string | null;

    @ApiProperty({description:'술장고_평가(개인평가)'})
    @IsString()
    readonly cabinet_review: string | null;

    @ApiProperty({description:'회원 이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
