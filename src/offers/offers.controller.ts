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
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../auth/auth-jwt.guard';
import { CustomRequest } from '../users/CustomRequest';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: CustomRequest,
    @Body() createOfferDto: CreateOfferDto,
  ) {
    return await this.offersService.create(req, createOfferDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Req() req: CustomRequest) {
    return await this.offersService.getByOwner(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Req() req: CustomRequest, @Param('id') id: string) {
    return await this.offersService.getById(req, id);
  }
}
