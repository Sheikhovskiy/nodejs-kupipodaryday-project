import { Wish } from '../entities/wish.entity';
import { ResponseWishDto } from './response-wish.dto';
import { UsersMapper } from '../../users/dto/users.mapper';
import { UserWishesDto } from './user-wishes-dto';

export class WishesMapper {
  static fromWishListToUserWishListDto(wishes: Wish[]) {
    return wishes.map((wish) => {
      return this.fromWishToUserWishDto(wish);
    });
  }

  static fromWishToUserWishDto(wish: Wish) {
    const userWishesDto = new UserWishesDto();
    userWishesDto.id = wish.id;
    userWishesDto.createdAt = wish.createdAt;
    userWishesDto.updatedAt = wish.updatedAt;
    userWishesDto.name = wish.name;
    userWishesDto.link = wish.link;
    userWishesDto.image = wish.image;
    userWishesDto.price = wish.price;
    userWishesDto.copied = wish.copied;
    userWishesDto.description = wish.description;
    userWishesDto.offers = wish.offers;

    return userWishesDto;
  }

  static fromWishListToResponseWishListDto(wishes: Wish[]) {
    return wishes.map((wish) => {
      return this.fromWishToResponseWishDto(wish);
    });
  }

  static fromWishToResponseWishDto(wish: Wish) {
    const responseWishDto = new ResponseWishDto();
    responseWishDto.id = wish.id;
    responseWishDto.createdAt = wish.createdAt;
    responseWishDto.updatedAt = wish.updatedAt;
    responseWishDto.name = wish.name;
    responseWishDto.link = wish.link;
    responseWishDto.image = wish.image;
    responseWishDto.price = wish.price;
    responseWishDto.raised = wish.raised;
    responseWishDto.copied = wish.copied;
    responseWishDto.description = wish.description;
    responseWishDto.owner = UsersMapper.fromUserToUserProfileResponse(
      wish.owner,
    );
    responseWishDto.offers = wish.offers;
    return responseWishDto;
  }
}
