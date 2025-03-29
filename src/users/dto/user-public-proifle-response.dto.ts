import { Length, IsOptional, IsString } from 'class-validator';

export class UserPublicProifleResponse {
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(1, 200)
  about: string;

  @IsOptional()
  avatar: string;

  createdAt: Date;

  updatedAt: Date;
}
