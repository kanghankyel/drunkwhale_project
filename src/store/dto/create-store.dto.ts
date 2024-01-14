import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateStoreDto {

    @ApiProperty({description:'스토어 고유번호'})
    @IsInt()
    @IsNotEmpty()
    readonly store_idx: number;

    @ApiProperty({description:'스토어 상호명'})
    @IsString()
    readonly store_name: string | null;

    @ApiProperty({description:'스토어 종류'})
    @IsString()
    readonly store_type: string | null;

    @ApiProperty({description:'스토어 전화번호'})
    @IsString()
    readonly store_phone: string | null;

    @ApiProperty({description:'스토어 사업자번호'})
    @IsString()
    readonly store_regist: string | null;

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
