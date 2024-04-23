import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateOwnerDto {

    @ApiProperty({description:'가맹주 이메일'})
    @IsString()
    readonly user_email: string | null;

    @ApiProperty({description:'가맹주 비밀번호'})
    @IsString()
    readonly user_pw: string | null;

    @ApiProperty({description:'가맹주 이름'})
    @IsString()
    readonly user_name: string | null;

    @ApiProperty({description:'가맹주 전화번호'})
    @IsString()
    readonly user_phone: string | null;

    @ApiProperty({description:'스토어 상호명'})
    @IsString()
    readonly store_name: string | null;

    @ApiProperty({description:'스토어 사업자번호'})
    @IsString()
    readonly store_registnum: string | null;

    @ApiProperty({description:'스토어 전화번호'})
    @IsString()
    readonly store_phone: string | null;

    @ApiProperty({description:'스토어 우편번호'})
    @IsString()
    readonly store_postcode: string | null;

    @ApiProperty({description:'스토어 주소'})
    @IsString()
    readonly store_add: string | null;

    @ApiProperty({description:'스토어 상세주소'})
    @IsString()
    readonly store_adddetail: string | null;

}