import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    user_pw?: string;

    @IsString()
    @IsOptional()
    user_phone?: string;

    @IsString()
    @IsOptional()
    user_info?: string;

}
