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
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CustomRequest } from '../users/CustomRequest';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
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
    return this.wishlistsService.create(req, createWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserWishlists(@Req() req: CustomRequest) {
    const wishlists = await this.wishlistsService.getUserWishlist(req);

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
    return this.wishlistsService.update(req, id, updateWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: CustomRequest, @Param('id') id: string) {
    return await this.wishlistsService.delete(req, id);
  }
}
