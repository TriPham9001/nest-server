import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from '../user/queries/get-user.query';
import { UserEntity } from '../user/user.entity';
import { Provider } from '../../constants/token.constant';
import { ConfigService } from '../../shared/services/config.service';
import { type Auth, google } from 'googleapis';
import { VerifyRequestDto } from './dtos/verify-request.dto';

@Injectable()
export class AuthService {
  private readonly googleOauthClient: Auth.OAuth2Client;
  constructor(
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {
    const clientID = this.configService.jwtConfig.googleClientId;
    const clientSecret = this.configService.jwtConfig.googleClientSecret;

    this.googleOauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async validateUser(email: string, pass: string): Promise<UserEntity> {
    const user = await this.queryBus.execute(
      new GetUserQuery({
        where: {
          email,
          needPasswordChange: false,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          password: true,
          userName: true,
          role: {
            name: true,
            slug: true,
          },
        },
        relations: ['role'],
      }),
    );

    if (!user || !(await UserEntity.comparePasswords(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    delete user.password;

    return user;
  }

  async validateSSOUser(
    verifyRequestDto: VerifyRequestDto,
  ): Promise<UserEntity> {
    try {
      let email: string;
      switch (verifyRequestDto.provider) {
        case Provider.GOOGLE:
          const ticket = await this.googleOauthClient.verifyIdToken({
            idToken: verifyRequestDto.idToken,
          });

          const payload = ticket.getPayload();
          email = payload.email;
          break;
        default:
          throw new UnauthorizedException('Invalid credentials');
      }

      if (
        this.configService.nodeEnv === 'development' &&
        !this.configService.jwtConfig.allowedEmails.includes(email)
      ) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return this.queryBus.execute(
        new GetUserQuery({
          where: {
            email,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            password: true,
            roleId: true,
            userName: true,
            role: {
              id: true,
              name: true,
              slug: true,
            },
          },
          relations: ['role'],
        }),
      );
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
