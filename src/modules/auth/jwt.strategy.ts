import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Provider } from '../../constants/token.constant';
import { ConfigService } from '../../shared/services/config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtConfig.jwtSecret,
    });
  }

  async validate(args: { sub: Uuid; provider: Provider }): Promise<UserEntity> {
    const cachedUser = await this.cacheManager.get<UserEntity>(
      `users:${args.sub}`,
    );

    if (!cachedUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    return cachedUser;
  }
}
