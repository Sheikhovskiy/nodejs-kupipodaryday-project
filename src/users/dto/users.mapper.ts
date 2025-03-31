import { User } from '../entities/user.entity';
import { UserProfileResponseDto } from './user-profile-response.dto';
import { UserPublicProfileResponse } from './user-public-profile-response.dto';
import { SignupUserResponse } from './signup-user-response.dto';

export class UsersMapper {
  static fromUserListToUserProfileResponseListDto(users: User[]) {
    return users.map((user) => {
      this.fromUserToUserProfileResponse(user);
    });
  }

  static fromUserToUserPublicProfileResponseDto(user: User) {
    const userPublicProfileResponseDto = new UserPublicProfileResponse();

    userPublicProfileResponseDto.id = user.id;
    userPublicProfileResponseDto.username = user.username;
    userPublicProfileResponseDto.about = user.about;
    userPublicProfileResponseDto.avatar = user.avatar;
    userPublicProfileResponseDto.createdAt = user.createdAt;
    userPublicProfileResponseDto.updatedAt = user.updatedAt;
    return userPublicProfileResponseDto;
  }

  static fromUserToSignupUserResponse(user: User) {
    const signUpResponse = new SignupUserResponse();
    signUpResponse.id = user.id;
    signUpResponse.username = user.username;
    signUpResponse.about = user.about;
    signUpResponse.avatar = user.avatar;
    signUpResponse.email = user.email;
    signUpResponse.createdAt = user.createdAt;
    signUpResponse.updatedAt = user.updatedAt;
    return signUpResponse;
  }

  static fromUserToUserProfileResponse(user: User) {
    const userProfileResponse = new UserProfileResponseDto();
    userProfileResponse.id = user.id;
    userProfileResponse.username = user.username;
    userProfileResponse.about = user.about;
    userProfileResponse.avatar = user.avatar;
    userProfileResponse.email = user.email;
    userProfileResponse.createdAt = user.createdAt;
    userProfileResponse.updatedAt = user.updatedAt;
    return userProfileResponse;
  }
}
