import { Wish } from '../../wishes/entities/wish.entity';
import { IsNumber, IsString } from 'class-validator';
import { UserPublicProifleResponse } from '../../users/dto/user-public-proifle-response.dto';

export class ResponseWishlistsDto {
  @IsNumber()
  id: number;

  createdAt: Date;

  updatedAt: Date;

  @IsString()
  name: string;

  @IsString()
  image: string;

  owner: UserPublicProifleResponse;

  items: Wish[];
}
