import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CustomRequest } from './CustomRequest';
import { UsersMapper } from './dto/users.mapper';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { WishesMapper } from '../wishes/dto/wishes.mapper';
import { FindUsersDto } from './dto/find-users.dto';
import { ResponseWishDto } from '../wishes/dto/response-wish.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getMe(@Req() req: CustomRequest): Promise<UserProfileResponseDto> {
    const user = await this.usersService.getMe(req);

    return UsersMapper.fromUserToUserProfileResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateProfile(
    @Req() req: CustomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.updateProfile(req, updateUserDto);

    return UsersMapper.fromUserToUserProfileResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/wishes')
  async getMyWishes(@Req() req: CustomRequest): Promise<ResponseWishDto[]> {
    const wishes = await this.usersService.getMyWishes(req);

    return WishesMapper.fromWishListToResponseWishListDto(wishes ? wishes : []);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUsername(@Param('username') username: string) {
    const user = await this.usersService.getByUsername(username);

    return UsersMapper.fromUserToUserPublicProfileResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const wishes = await this.usersService.getUserWishes(username);

    return WishesMapper.fromWishListToUserWishListDto(wishes);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find')
  async findUser(
    @Req() req: CustomRequest,
    @Body() findUsersDto: FindUsersDto,
  ) {
    const users = await this.usersService.findByQuery(findUsersDto);
    return UsersMapper.fromUserListToUserProfileResponseListDto(users);
  }
}
