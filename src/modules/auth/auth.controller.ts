import {
  BadRequestException,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenService } from '../token/token.service';
import { Provider } from '../../constants/token.constant';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { UserDto } from '../user/dtos/user.dto';
import { ResponseMessage } from '../../decorators/response-message.decorator';
import { Auth } from '../../decorators/http.decorator';
import { LoginRequestDto } from './dtos/login-request.dto';
import { UserService } from '../user/user.service';
import { VerifyRequestDto } from './dtos/verify-request.dto';
import { UserAlreadyExistException } from '../../exceptions/user-already-exist.exception';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { RegisterRequestDto } from './dtos/register-request';
import { RoleService } from '../role/role.service';
import { RoleType } from '../../constants';
import { UpdateUserDto } from '../user/dtos/update-user.dto';
import { UpdateResult } from 'typeorm';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { SupabaseService } from 'src/shared/services/supabase-s3.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly fileService: FileService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Version('1')
  @Post('login')
  @ResponseMessage('Logged in successfully')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginRequestDto: LoginRequestDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }> {
    const { email, password } = loginRequestDto;

    const user = await this.authService.validateUser(email, password);

    user.lastLoginAt = new Date();

    const token = await this.tokenService.generateAuthTokens(
      user,
      Provider.LOCAL,
    );

    await this.cacheManager.set(`users:${user.id}`, user);

    return token;
  }

  @Version('1')
  @Post('register')
  @ResponseMessage('Registered successfully')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterRequestDto): Promise<UserDto> {
    if (
      await this.userService.findOne({ where: { email: registerDto.email } })
    ) {
      throw new BadRequestException('Email already exists');
    }

    if (
      await this.userService.findOne({
        where: { userName: registerDto.userName },
      })
    ) {
      throw new UserAlreadyExistException();
    }

    const roleUser = await this.roleService.findOne({
      where: { slug: RoleType.USER },
    });

    if (!roleUser) {
      throw new NotFoundException('Role not found');
    }

    registerDto.roleId = roleUser.id;

    const user = await this.userService.createUser(registerDto);

    return user.toDto();
  }

  @Version('1')
  @Post('verify-sso')
  @ResponseMessage('Verified successfully')
  @HttpCode(HttpStatus.OK)
  async verify(@Body() verifyRequestDto: VerifyRequestDto): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    refreshTokenExpires: number;
  }> {
    let user = await this.authService.validateSSOUser(verifyRequestDto);

    let lastLoginAt = new Date();

    if (!user) {
      const roleUser = await this.roleService.findOne({
        where: { slug: RoleType.USER },
      });

      if (!roleUser) {
        throw new NotFoundException('Role not found');
      }

      const newUser = new RegisterRequestDto({
        email: verifyRequestDto.user.email,
        password: null,
        firstName: verifyRequestDto.user.firstName,
        lastName: verifyRequestDto.user.lastName,
        image: verifyRequestDto.user.image,
        roleId: roleUser.id,
        userName: `@${verifyRequestDto.user.firstName}${verifyRequestDto.user.lastName}`,
      });

      user = await this.userService.createUser(
        newUser,
        verifyRequestDto.provider,
      );

      lastLoginAt = user.lastLoginAt;
    } else {
      await this.userService.update(
        { id: user.id },
        {
          lastLoginAt,
        },
      );
    }

    const tokens = await this.tokenService.generateAuthTokens(
      user,
      verifyRequestDto.provider,
    );

    await this.cacheManager.set(`users:${user.id}`, user);

    return tokens;
  }

  @Version('1')
  @Auth()
  @Get('me')
  @ResponseMessage('Fetched me successfully')
  @HttpCode(HttpStatus.OK)
  async getProfile(@AuthUser() user: UserEntity): Promise<UserEntity> {
    const userEntity = await this.userService.findOne({
      where: { id: user.id },
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
      },
      relations: ['role'],
    });

    return userEntity;
  }

  @Version('1')
  @Patch('me')
  @Auth()
  @ResponseMessage('Updated me successfully')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  async updateMe(
    @AuthUser() user: UserEntity,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    const { firstName, lastName, userName, description } = updateUserDto;

    const userEntity = await this.userService.findOne({
      where: { id: user.id },
      select: {
        id: true,
        lastLoginAt: true,
        updateNamedAt: true,
        userName: true,
        description: true,
      },
    });

    const updateData: Partial<UserEntity> = {
      firstName,
      lastName,
    };

    if (userName && userName !== userEntity.userName) {
      // Check if updateNamedAt > 30 days ago
      const now = moment();
      const updateNamedAt = moment(userEntity.updateNamedAt);
      const daysSinceLastUpdate = now.diff(updateNamedAt, 'days');

      if (daysSinceLastUpdate < 30) {
        throw new BadRequestException(
          'You can only change your username once every 30 days.',
        );
      }

      // Check if the new userName is already taken
      const existingUserName = await this.userService.findOne({
        where: { userName },
      });

      if (existingUserName) {
        throw new BadRequestException('Username already exists');
      }

      updateData.userName = userName;
      updateData.updateNamedAt = new Date();
    }

    if (description) {
      updateData.description = description;
    }

    const cachedUser = await this.cacheManager.get<UserEntity>(
      `users:${user.id}`,
    );

    await this.cacheManager.set(`users:${user.id}`, {
      ...cachedUser,
      ...updateData,
    });

    return this.userService.update(
      {
        id: user.id,
      },
      {
        ...updateData,
      },
    );
  }

  @Version('1')
  @Post('logout')
  @Auth()
  @ResponseMessage('Logged out successfully')
  @HttpCode(HttpStatus.OK)
  async logout(@AuthUser() user: UserEntity): Promise<void> {
    return this.cacheManager.del(`users:${user.id}`);
  }

  // @Version('1')
  // @Auth()
  // @Post('refresh-token')
  // @ResponseMessage('Refresh token successfully')
  // async refreshToken(
  //   @AuthUser() user: UserEntity,
  // ): Promise<CreateAuthTokensPayloadDto> {
  //   return this.tokenService.refreshAuthTokens(user, Provider.LOCAL);
  // }
}
