import { IsString, IsNumber, Length, IsOptional } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  owner: number;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;
}
