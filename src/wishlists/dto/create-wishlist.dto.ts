import { IsString, IsOptional } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  itemsId: number[];
}
