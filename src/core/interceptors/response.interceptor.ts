import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSAGE_KEY } from '../core.constants';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  private readonly sensitiveFields = ['password'];

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const message =
      this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'Success';

    return next.handle().pipe(
      map((data: T): ApiResponse<T> => {
        if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
          return data as unknown as ApiResponse<T>;
        }

        const sanitizedData = this.removeSensitiveFields(data);

        return {
          success: true,
          data: sanitizedData,
          message,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.path,
            method: request.method,
          },
        };
      }),
    );
  }

  private removeSensitiveFields<T>(data: T): T {
    if (!data || typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item: unknown) => this.removeSensitiveFields(item)) as T;
    }

    const cleaned = { ...data } as Record<string, unknown>;
    this.sensitiveFields.forEach((field) => {
      if (field in cleaned) {
        delete cleaned[field];
      }
    });

    return cleaned as T;
  }
}
