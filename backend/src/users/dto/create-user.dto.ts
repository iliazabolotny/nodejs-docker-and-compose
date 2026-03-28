import { IsEmail, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsString()
  about: string;
  @IsUrl()
  avatar: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}