import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    @IsInt()
    @IsNotEmpty()
    readonly user_idx: number;

    @IsString()
    @IsNotEmpty()
    readonly user_id: string;

    @IsString()
    readonly user_pw: string;

    @IsString()
    readonly user_info: string;

    @IsString()
    readonly user_createdate: string;

}