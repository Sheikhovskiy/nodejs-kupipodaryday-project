import { Wish } from '../../wishes/entities/wish.entity';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { UserPublicProfileResponse } from '../../users/dto/user-public-profile-response.dto';

export class ResponseWishlistsDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  name: string;

  @IsString()
  image: string;

  owner: UserPublicProfileResponse;

  items: Wish[];
}
