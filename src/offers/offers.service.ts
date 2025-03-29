import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private wishRepository: Repository<Wish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь не найден`);
    }

    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });

    if (!wish) {
      throw new NotFoundException(
        `Подарок с id ${createOfferDto.itemId} не найден`,
      );
    }

    if (wish.owner.id === userId) {
      throw new ForbiddenException(
        `Нельзя вносить деньги на собственные подарки`,
      );
    }

    const newRaisedAmount =
      parseFloat(wish.raised.toString()) + createOfferDto.amount;

    const isRaiseCorrect = newRaisedAmount <= wish.price;

    if (!isRaiseCorrect) {
      throw new ForbiddenException(
        `Нельзя скидываться на желание, суммой, превышающий остаток`,
      );
    }

    await this.wishRepository.update(
      { id: createOfferDto.itemId },
      { raised: newRaisedAmount },
    );

    const offer = this.offerRepository.create({
      ...createOfferDto,
      item: wish,
      user: user,
    });
    return await this.offerRepository.save(offer);
  }

  async findOne(query: FindManyOptions<Offer>): Promise<Offer | null> {
    return await this.offerRepository.findOne(query);
  }

  async findMany(query: FindManyOptions<Offer>): Promise<Offer[] | null> {
    return await this.offerRepository.find(query);
  }

  async updateOne(
    id: number,
    updateOfferDto: UpdateOfferDto,
  ): Promise<Offer | null> {
    await this.offerRepository.update(id, updateOfferDto);
    return await this.offerRepository.findOne({ where: { id: id } });
  }

  async removeOne(id: number): Promise<void> {
    await this.offerRepository.delete(id);
  }
}
