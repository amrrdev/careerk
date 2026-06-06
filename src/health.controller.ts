import { Controller, Get } from '@nestjs/common';
import { Auth } from './modules/iam/authentication/decorators/auth.decorator';
import { AuthType } from './modules/iam/enums/auth-type.enum';

@Controller('health')
@Auth(AuthType.None)
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
