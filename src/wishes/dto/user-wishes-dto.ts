import {
  Length,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsString()
  link: string;

  @IsString()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  offers: Offer[];
}
