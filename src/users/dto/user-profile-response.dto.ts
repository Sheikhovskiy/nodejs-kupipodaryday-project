import {
  IsEmail,
  Length,
  IsOptional,
  IsString,
  IsDate,
  IsUrl,
  IsNumber,
} from 'class-validator';

export class UserProfileResponseDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @Length(1, 64)
  username: string;

  @IsString()
  @Length(1, 200)
  about: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
