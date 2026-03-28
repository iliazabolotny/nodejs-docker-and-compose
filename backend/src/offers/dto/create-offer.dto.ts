import { IsBooleanString, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsBooleanString()
  hidden: boolean;

  @IsNotEmpty()
  @IsInt()
  itemId: number;
}
