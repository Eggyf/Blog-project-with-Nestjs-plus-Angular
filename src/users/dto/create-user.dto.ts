import { IsEmail, IsNumber, IsString } from "class-validator";
import { BeforeInsert } from "typeorm";

export class CreateUserDto {
    @IsNumber()
    id: number;
    @IsString()
    name: string;
    @IsString()
    username: string;
    @IsString()
    password?: string;
    @IsEmail()
    email: string;

}
