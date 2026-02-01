import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { JobSeekerModule } from '../job-seeker/job-seeker.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [JobSeekerModule, CompanyModule],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    {
      provide: HashingService,
      useClass: BcryptService,
    },
  ],
})
export class IamModule {}
