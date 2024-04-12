import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStoreDto {

    @ApiProperty({description:'스토어 상호명'})
    @IsString()
    readonly store_name: string | null;

    @ApiProperty({description:'스토어 사업자번호'})
    @IsString()
    readonly store_registnum: string | null;

    @ApiProperty({description:'스토어 대표자명'})
    @IsString()
    readonly store_ownername: string | null;

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

    @ApiProperty({description:'스토어 상태 ( A=스토어활동중, B=스토어블락, C=스토어탈퇴, W=스토어신청대기중 )'})
    @IsString()
    readonly store_status: string | null;

    @ApiProperty({description:'스토어 회원이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
