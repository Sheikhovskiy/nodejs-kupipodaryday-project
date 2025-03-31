import {
  Length,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
} from 'class-validator';

export class UserPublicProfileResponse {
  @IsNumber()
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(1, 200)
  about: string;

  @IsOptional()
  avatar: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
