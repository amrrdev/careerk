import { UnauthorizedException } from '@nestjs/common';

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor(message = 'Access denied') {
    super(message);
  }
}
