import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
  UnauthorizedException,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CustomRequest } from '../users/CustomRequest';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { FindOptionsWhere } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistsMapper } from './dto/wishlists.mapper';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: CustomRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }
    const userId = parseInt(req.user.id);

    return this.wishlistsService.create(createWishlistDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserWishlists(@Req() req: CustomRequest) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wishlists = await this.wishlistsService.findAll({
      where: { owner: { id: parseInt(req.user.id) } },
      relations: ['owner', 'items'],
    });

    return WishlistsMapper.fromWishlistsListToWishlistsListResponseDto(
      wishlists,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getWishlists(@Req() req: CustomRequest, @Param('id') id: string) {
    return this.wishlistsService.findOne({ where: { id: parseInt(id) } });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wishlist = await this.wishlistsService.findOne({
      where: { id: parseInt(id) },
    });
    if (!wishlist) return;

    if (wishlist.owner.id !== parseInt(req.user.id)) return;

    const updateQuery: FindOptionsWhere<Wishlist> = {
      id: parseInt(req.user.id),
    };

    return await this.wishlistsService.updateOne(
      updateQuery,
      updateWishlistDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: CustomRequest, @Param('id') id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wishlist = await this.wishlistsService.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
    });

    if (!wishlist) return;

    const deleteQuery: FindOptionsWhere<Wishlist> = {
      id: parseInt(id),
      owner: { id: parseInt(req.user.id) },
    };

    return await this.wishlistsService.removeOne(deleteQuery);
  }
}
