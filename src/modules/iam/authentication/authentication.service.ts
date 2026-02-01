import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositores/company.repository';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hashingService: HashingService,
  ) {}

  async registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto) {
    try {
      // TODO: hmmm, I think there’s a better way.
      const [isJobSeekerExists, isCompanyExists] = await Promise.all([
        this.jobSeekerRepository.existsByEmail(registerJobSeekerDto.email),
        this.companyRepository.existsByEmail(registerJobSeekerDto.email),
      ]);

      if (isJobSeekerExists || isCompanyExists) {
        throw new ConflictException('An account with this email already exists');
      }

      const hashedPassword = await this.hashingService.hash(registerJobSeekerDto.password);
      const jobSeeker = await this.jobSeekerRepository.create({
        ...registerJobSeekerDto,
        password: hashedPassword,
      });

      // TODO: implement JWT access/refresh tokens

      const { password, ...result } = jobSeeker;
      return result;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create job seeker');
    }
  }
}
