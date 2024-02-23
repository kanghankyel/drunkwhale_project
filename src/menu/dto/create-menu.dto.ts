import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateMenuDto {

    @ApiProperty({description:'메뉴 상품사진'})
    @IsString()
    readonly menu_image: string | null;

    @ApiProperty({description:'메뉴 상품명'})
    @IsString()
    readonly menu_name: string | null;

    @ApiProperty({description:'메뉴 상품소개'})
    @IsString()
    readonly menu_info: string | null;

    @ApiProperty({description:'메뉴 상품가격'})
    @IsString()
    readonly menu_price: string | null;

    @ApiProperty({description:'스토어 회원이메일(FK)'})
    @IsString()
    readonly user_email: string | null;

}
