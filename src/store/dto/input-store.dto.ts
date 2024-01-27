import { PartialType } from "@nestjs/mapped-types";
import { CreateStoreDto } from "./create-store.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InputStoreDto extends PartialType(CreateStoreDto) {

    @ApiProperty({description:'스토어 개장시간'})
    @IsString()
    store_opentime: string | null;

    @ApiProperty({description:'스토어 폐장시간'})
    @IsString()
    store_closetime: string | null;

    @ApiProperty({description:'스토어 소개정보'})
    @IsString()
    store_info: string | null;

    @ApiProperty({description:'스토어 회원이메일'})
    @IsString()
    readonly user_email: string | null;

}