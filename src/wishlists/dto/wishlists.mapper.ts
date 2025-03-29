import { Wishlist } from '../entities/wishlist.entity';
import { ResponseWishlistsDto } from './response-wishlist.dto';
import { UsersMapper } from '../../users/dto/users.mapper';

export class WishlistsMapper {
  static fromWishlistsListToWishlistsListResponseDto(wishlists: Wishlist[]) {
    return wishlists.map((wishlist) => {
      return this.fromWishlistsToWishlistsResponseDto(wishlist);
    });
  }

  static fromWishlistsToWishlistsResponseDto(wishlist: Wishlist) {
    const responseWishlists = new ResponseWishlistsDto();
    responseWishlists.id = wishlist.id;
    responseWishlists.createdAt = wishlist.createdAt;
    responseWishlists.updatedAt = wishlist.updatedAt;
    responseWishlists.name = wishlist.name;
    responseWishlists.image = wishlist.image;
    responseWishlists.owner =
      UsersMapper.fromUserToUserPublicProfileResponseDto(wishlist.owner);
    responseWishlists.items = wishlist.items;
    return responseWishlists;
  }
}
