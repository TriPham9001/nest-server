import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Version,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import { UserEntity } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Version('1')
  @Get(':userName')
  @ResponseMessage('Fetched user successfully')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Param('userName') userName: string): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({
      where: { userName },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        userName: true,
        description: true,
        role: {
          name: true,
          slug: true,
        },
        createdAt: true,
      },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    return userEntity;
  }
}
