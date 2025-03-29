import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  Req,
  Param,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CustomRequest } from '../users/CustomRequest';
// import { UpdateOfferDto } from './dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req: CustomRequest, @Body() createOfferDto: CreateOfferDto) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    const userId = parseInt(req.user.id);

    return this.offersService.create(createOfferDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Req() req: CustomRequest) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    return await this.offersService.findMany({
      where: { user: { id: parseInt(req.user.id) } },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: CustomRequest, @Param('id') id: string) {
    if (!req.user?.id) {
      throw new UnauthorizedException(`Пользователь не найден`);
    }

    return await this.offersService.findOne({
      where: {
        id: parseInt(id),
        user: { id: parseInt(req.user.id) },
      },
      relations: ['owner', 'items'],
    });
  }
}
