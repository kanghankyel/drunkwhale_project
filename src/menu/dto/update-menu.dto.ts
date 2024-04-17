import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateMenuDto {
 
    @ApiProperty({description:'메뉴 고유번호'})
    @IsString()
    readonly menu_idx: number;

    @ApiProperty({description:'메뉴 상품이미지 (원본파일명)'})
    @IsString()
    @IsOptional()
    readonly menu_imgname?: string | null;

    @ApiProperty({description:'메뉴 상품명'})
    @IsString()
    @IsOptional()
    readonly menu_name?: string | null;

    @ApiProperty({description:'메뉴 상품타입'})
    @IsString()
    @IsOptional()
    readonly menu_type?: string | null;

    @ApiProperty({description:'메뉴 상품소개'})
    @IsString()
    @IsOptional()
    readonly menu_info?: string | null;

    @ApiProperty({description:'메뉴 상품가격'})
    @IsString()
    @IsOptional()
    readonly menu_price?: string | null;

    @ApiProperty({description:'스토어 회원이메일(FK)'})
    @IsString()
    @IsOptional()
    readonly user_email?: string | null;

}