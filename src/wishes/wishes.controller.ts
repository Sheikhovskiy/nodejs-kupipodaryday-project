import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CustomRequest } from '../users/CustomRequest';
import { WishesMapper } from './dto/wishes.mapper';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: CustomRequest,
    @Body() createWishDto: CreateWishDto,
  ) {
    return await this.wishesService.create(req, createWishDto);
  }

  @Get('/last')
  async getLastWish() {
    const wishes = await this.wishesService.getLastWish();

    return WishesMapper.fromWishListToResponseWishListDto(wishes);
  }

  @Get('/top')
  async getTop() {
    const wishes = await this.wishesService.getTop();

    return WishesMapper.fromWishListToResponseWishListDto(wishes);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: CustomRequest, @Param('id') id: string) {
    const wish = await this.wishesService.getById(req, id);

    return WishesMapper.fromWishToResponseWishDto(wish);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    const wish = await this.wishesService.update(req, id, updateWishDto);

    return WishesMapper.fromWishToResponseWishDto(wish);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: CustomRequest, @Param('id') id: string) {
    const wish = await this.wishesService.delete(req, id);
    return WishesMapper.fromWishToResponseWishDto(wish);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  async copy(@Req() req: CustomRequest, @Param('id') id: string) {
    return await this.wishesService.copy(req, id);
  }
}
