import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CustomRequest } from '../users/CustomRequest';
import { WishesMapper } from './dto/wishes.mapper';
import { UpdateWishDto } from './dto/update-wish.dto';
import { FindOptionsWhere, Not } from 'typeorm';
import { Wish } from './entities/wish.entity';

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
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    createWishDto.owner = parseInt(req.user.id);

    return await this.wishesService.create(createWishDto);
  }

  @Get('/last')
  async getLastWish() {
    const wishes = await this.wishesService.findAll({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner'],
    });

    return WishesMapper.fromWishListToResponseWishListDto(wishes);
  }

  @Get('/top')
  async getTop() {
    const wishes = await this.wishesService.findAll({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner'],
    });

    return WishesMapper.fromWishListToResponseWishListDto(wishes);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: CustomRequest, @Param('id') id: string) {
    const wish = await this.wishesService.findOne({
      where: { id: parseInt(id) },
      relations: ['owner', 'offers'],
    });

    if (!wish) return {};

    return WishesMapper.fromWishToResponseWishDto(wish);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Req() req: CustomRequest,
    @Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const userId = parseInt(req.user.id);

    const existingWish = await this.wishesService.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
      relations: ['offers', 'owner'],
    });

    if (!existingWish) {
      throw new NotFoundException(`У вас не существует такого желания`);
    }

    if (existingWish.price !== updateWishDto.price) {
      if (existingWish?.offers.length > 0) {
        throw new ConflictException(
          `Нельзя изменять цену, когда уже есть желающие скинуться`,
        );
      }
    }

    if (updateWishDto.raised && existingWish.raised !== updateWishDto.raised) {
      throw new ForbiddenException(
        `Сумма собранных средств формируется автоматически и не может быть изменена`,
      );
    }

    const where: FindOptionsWhere<Wish> = {
      id: parseInt(id),
      owner: { id: userId },
    };

    await this.wishesService.updateOne(where, updateWishDto);

    const updatedWish = await this.wishesService.findOne({
      where: { id: parseInt(id) },
      relations: ['owner', 'offers', 'offers.user'],
    });

    if (!updatedWish) return {};

    return WishesMapper.fromWishToResponseWishDto(updatedWish);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req: CustomRequest, @Param('id') id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wish = await this.wishesService.findOne({
      where: {
        id: parseInt(id),
        owner: { id: parseInt(req.user.id) },
      },
      relations: ['owner', 'offers'],
    });

    if (!wish) return {};

    const deleteQuery: FindOptionsWhere<Wish> = {
      id: parseInt(id),
    };

    await this.wishesService.removeOne(deleteQuery);
    return WishesMapper.fromWishToResponseWishDto(wish);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  async copy(@Req() req: CustomRequest, @Param('id') id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const wish = await this.wishesService.findOne({
      where: {
        id: parseInt(id),
        owner: { id: Not(parseInt(req.user.id)) },
      },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден или это ваш собственный');
    }

    await this.wishesService.updateOne(
      { id: parseInt(id) },
      { copied: (wish.copied || 0) + 1 },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, owner: __, ...wishData } = wish;

    const createWishDto: CreateWishDto = {
      ...wishData,
      owner: parseInt(req.user.id),
    };

    return await this.wishesService.create(createWishDto);
  }
}
