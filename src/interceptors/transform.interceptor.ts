import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  meta: any;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ignoreRoutes = this.reflector.get<string[]>(
      'ignore_response_transform',
      context.getHandler(),
    );

    if (ignoreRoutes) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        const response = {
          message:
            this.reflector.get<string>(
              'response_message',
              context.getHandler(),
            ) ||
            data.message ||
            '',
          statusCode: context.switchToHttp().getResponse().statusCode,
          data: Array.isArray(data.data) ? data.data : data,
          meta: {},
        };

        if (data.meta) {
          response.meta = data.meta;
        }

        return response;
      }),
    );
  }
}
