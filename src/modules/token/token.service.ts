import moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { Provider, TokenType } from '../../constants/token.constant';
import { ConfigService } from 'src/shared/services/config.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateAuthTokensRequestDto } from './dtos/create-auth-tokens-request.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAuthTokensCommand } from './commands/create-auth-tokens.command';
import { CreateTokenRequestDto } from './dtos/create-token-request.dto';
import { CreateEmailVerificationTokenCommand } from './commands/create-email-verification-token.command';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  generateToken(
    userId: Uuid,
    exp: moment.Moment,
    provider: Provider,
    type: TokenType,
    metadata?: { [key: string]: any }[],
  ): Promise<string> {
    const payload = {
      sub: userId,
      provider,
      type,
      iat: moment().unix(),
      exp: exp.unix(),
    };

    if (metadata) {
      metadata.forEach((meta) => {
        payload[meta.key] = meta.value;
      });
    }

    return this.jwtService.signAsync(payload);
  }

  async generateAuthTokens(
    user: UserEntity,
    provider: Provider,
  ): Promise<{
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires: number;
  }> {
    try {
      const accessTokenExpires = moment().add(
        this.configService.jwtConfig.jwtAccessExpirationMinutes,
        'minutes',
      );

      const accessTokenString = await this.generateToken(
        user.id,
        accessTokenExpires,
        provider,
        TokenType.ACCESS,
      );

      const refreshTokenExpires = moment().add(
        this.configService.jwtConfig.jwtRefreshExpirationDays,
        'days',
      );

      const refreshTokenString = await this.generateToken(
        user.id,
        refreshTokenExpires,
        provider,
        TokenType.REFRESH,
      );

      const accessToken = new CreateAuthTokensRequestDto({
        provider: Provider.LOCAL,
        type: TokenType.ACCESS,
        userId: user.id,
        token: accessTokenString,
        expiresAt: accessTokenExpires.toDate(),
      });
      const refreshToken = new CreateAuthTokensRequestDto({
        provider: Provider.LOCAL,
        type: TokenType.REFRESH,
        userId: user.id,
        token: refreshTokenString,
        expiresAt: refreshTokenExpires.toDate(),
      });

      await this.commandBus.execute(
        new CreateAuthTokensCommand(accessToken, refreshToken),
      );

      return {
        accessToken: accessTokenString,
        accessTokenExpires: accessTokenExpires.unix(),
        refreshToken: refreshTokenString,
        refreshTokenExpires: refreshTokenExpires.unix(),
      };
    } catch (error) {
      throw error;
    }
  }

  async generateEmailVerificationToken(user: UserEntity): Promise<TokenEntity> {
    const exp = moment().add(
      this.configService.jwtConfig.jwtVerifyEmailExpirationMinutes,
      'minutes',
    );

    const tokenString = await this.generateToken(
      user.id,
      exp,
      Provider.LOCAL,
      TokenType.VERIFY_EMAIL,
    );

    const createTokenRequestDto = new CreateTokenRequestDto({
      provider: Provider.LOCAL,
      type: TokenType.VERIFY_EMAIL,
      userId: user.id,
      token: tokenString,
      expiresAt: exp.toDate(),
    });

    return this.commandBus.execute(
      new CreateEmailVerificationTokenCommand(createTokenRequestDto),
    );
  }

  getPayloadFromToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
