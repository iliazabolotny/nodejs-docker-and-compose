import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;
  @IsString()
  @Length(0, 200)
  about: string;
  @IsUrl()
  avatar: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(2)
  password: string;
}