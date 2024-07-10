import { IsEmail, IsEnum, isEnum, IsNumber, IsString } from "class-validator";
import { BeforeInsert } from "typeorm";
import { UserRole } from "../entities/user.entity";

export class CreateUserDto {
    @IsNumber()
    id?: number;
    @IsString()
    name: string;
    @IsString()
    username: string;
    @IsString()
    password?: string;
    @IsEmail()
    email: string;
    @IsEnum(UserRole)
    role: UserRole

}
