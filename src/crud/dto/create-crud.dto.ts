import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCrudDto {

    @IsInt()
    @IsNotEmpty()
    readonly crud_idx: number;

    @IsString()
    @IsNotEmpty()
    readonly crud_name: string;

    @IsString()
    readonly crud_info: string;

    @IsString()
    readonly crud_createdate: string;

}
