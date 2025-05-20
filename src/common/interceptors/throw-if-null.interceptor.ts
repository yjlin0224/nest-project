import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Response } from 'express'
import is from '@sindresorhus/is'

@Injectable()
export class ThrowIfNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data: unknown) => {
        const status = response.statusCode
        console.log('status', status)
        console.log('data', data)
        if (is.nullOrUndefined(data) && status !== 204) {
          throw new NotFoundException()
        }
        return data
      }),
    )
  }
}
