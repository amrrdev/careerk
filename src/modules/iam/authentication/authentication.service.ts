import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hashingService: HashingService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const [jobSeeker, company] = await Promise.all([
        this.jobSeekerRepository.findByEmail(loginDto.email),
        this.companyRepository.findByEmail(loginDto.email),
      ]);

      const user = jobSeeker || company;
      const userType = jobSeeker ? 'job-seeker' : company ? 'compant' : null;
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await this.hashingService.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
      // TODO: Generate JWT tokens with userType in payload
      return {
        status: 'success',
        ...user,
        userType,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create job seeker');
    }
  }

  async registerJobSeeker(registerJobSeekerDto: RegisterJobSeekerDto) {
    try {
      // TODO: hmmm, I think there’s a better way.
      await this.checkEmailExists(registerJobSeekerDto.email);

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

  private async checkEmailExists(email: string): Promise<void> {
    const [isJobSeekerExists, isCompanyExists] = await Promise.all([
      this.jobSeekerRepository.existsByEmail(email),
      this.companyRepository.existsByEmail(email),
    ]);

    if (isJobSeekerExists || isCompanyExists) {
      throw new ConflictException('An account with this email already exists');
    }
  }

  // async registerCompany(registerCompanyDto: RegisterCompanyDto) {}
}
