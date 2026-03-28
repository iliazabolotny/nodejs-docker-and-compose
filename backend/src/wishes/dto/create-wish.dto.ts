import { IsNumber, IsString, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;
  @IsUrl()
  link: string;
  @IsUrl()
  image: string;
  @IsNumber()
  @Min(1)
  price: number;
  @IsString()
  description: string;

  copied?: number;
}