import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
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
import { FindOptionsWhere } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
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
    if (!req.user?.id)
      throw new UnauthorizedException(`Пользователь не найден`);

    const user = await this.usersService.findOne({
      where: { id: parseInt(req.user.id) },
      relations: [
        'wishes',
        'wishes.owner',
        'offers',
        'offers.item',
        'wishlists',
      ],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден в базе данных');
    }

    return UsersMapper.fromUserToUserProfileResponse(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/me')
  async updateProfile(
    @Req() req: CustomRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto | undefined> {
    if (!req.user?.id) return;

    await this.usersService.updateOne(
      { id: parseInt(req.user.id) },
      updateUserDto,
    );

    const updatedUser = await this.usersService.findOne({
      where: { id: parseInt(req.user.id) },
    });

    if (!updatedUser) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return UsersMapper.fromUserToUserProfileResponse(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me/wishes')
  async getMyWishes(@Req() req: CustomRequest): Promise<ResponseWishDto[]> {
    if (!req.user?.id)
      throw new UnauthorizedException(`Пользователь не найден`);

    const userId =
      typeof req.user?.id === 'string' ? parseInt(req.user.id) : req.user.id;

    const where: FindOptionsWhere<Wish> = {
      owner: { id: userId },
    };

    const wishes = await this.wishesService.findAll({
      where,
      relations: ['owner', 'offers', 'offers.user', 'offers.item'],
    });

    return WishesMapper.fromWishListToResponseWishListDto(wishes ? wishes : []);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async getUsername(@Param('username') username: string) {
    const user = await this.usersService.findOne({
      where: { username: username },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    return UsersMapper.fromUserToUserPublicProfileResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string) {
    const wishes = await this.wishesService.findAll({
      where: { owner: { username: username } },
    });
    return WishesMapper.fromWishListToUserWishListDto(wishes);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/find')
  async findUser(
    @Req() req: CustomRequest,
    @Body() findUsersDto: FindUsersDto,
  ) {
    const query = findUsersDto.query;

    if (query.includes('@')) {
      const user = await this.usersService.findOne({ where: { email: query } });
      return UsersMapper.fromUserListToUserProfileResponseListDto(
        user ? [user] : [],
      );
    }

    const users = await this.usersService.findMany({
      where: { username: query },
    });
    return UsersMapper.fromUserListToUserProfileResponseListDto(users);
  }
}
