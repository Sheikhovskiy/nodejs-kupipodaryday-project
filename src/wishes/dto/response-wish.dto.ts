import {
  Length,
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { UserProfileResponseDto } from '../../users/dto/user-profile-response.dto';

export class ResponseWishDto {
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

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  owner: UserProfileResponseDto;

  offers: Offer[];
}
