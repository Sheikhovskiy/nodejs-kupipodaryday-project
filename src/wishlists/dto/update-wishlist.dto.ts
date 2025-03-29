import { IsString, IsOptional } from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsOptional()
  itemsId: number[];
}
