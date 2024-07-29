import { Transport } from '@nestjs/microservices';
import { Controller, Get, Req } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Request as ExpressRequest, Router } from 'express';
import { AppService } from './app.service';
import { ConfigService } from './shared/services/config.service';

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private readonly appService: AppService,
    private readonly microservice: MicroserviceHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('routes')
  getRoutes(@Req() req: ExpressRequest): { routes: string[] } {
    const router = req.app._router as Router;
    return {
      routes: router.stack
        .map((layer) => {
          if (layer.route) {
            const path = layer.route?.path;
            const method = layer.route?.stack[0].method;
            return `${method.toUpperCase()} ${path}`;
          }
        })
        .filter((item) => item !== undefined),
    };
  }

  @Get('healthcheck')
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      async () =>
        this.microservice.pingCheck('EventStore', {
          // TODO: design a custom EventStore healthIndicator
          transport: Transport.TCP,
          options: {
            host: this.configService.get('EVENT_STORE_HOSTNAME'),
            port: this.configService.getNumber('EVENT_STORE_TCP_PORT'),
          },
        }),
      async () => this.db.pingCheck('database'),
    ]);
  }
}
