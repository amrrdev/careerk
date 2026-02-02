import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from '../hashing/hashing.service';
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
import { RegisterJobSeekerDto } from './dto/register-job-seeker.dto';
import { LoginDto } from './dto/login.dto';
import jwtConfig from '../config/jwt.config';
import { type ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '../enums/user-type.enum';
import { ActiveUserData } from '../interfaces/active-user.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtConfigurations: ConfigType<typeof jwtConfig>,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const [jobSeeker, company] = await Promise.all([
        this.jobSeekerRepository.findByEmail(loginDto.email),
        this.companyRepository.findByEmail(loginDto.email),
      ]);

      const user = jobSeeker || company;
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const userType = jobSeeker ? UserType.JOB_SEEKER : UserType.COMPANY;

      const isPasswordValid = await this.hashingService.compare(loginDto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return await this.generateTokens({ email: user.email, sub: user.id, type: userType });
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Login failed');
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

      const { accessToken, refreshToken } = await this.generateTokens({
        email: jobSeeker.email,
        sub: jobSeeker.id,
        type: UserType.JOB_SEEKER,
      });

      const { password, ...result } = jobSeeker;
      return {
        ...result,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Failed to create job seeker');
    }
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const user = await this.jwtService.verifyAsync<ActiveUserData>(refreshTokenDto.refreshToken, {
        secret: this.jwtConfigurations.secret,
        issuer: this.jwtConfigurations.issuer,
        audience: this.jwtConfigurations.audience,
      });

      const exists =
        user.type === UserType.JOB_SEEKER
          ? await this.jobSeekerRepository.existsByEmail(user.email)
          : await this.companyRepository.existsByEmail(user.email);

      if (!exists) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return await this.generateTokens(user);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid refresh token');
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

  private async generateTokens(user: ActiveUserData) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(user.sub, this.jwtConfigurations.accessTokenTtl, {
        email: user.email,
        type: user.type,
      }),
      this.signToken<Partial<ActiveUserData>>(user.sub, this.jwtConfigurations.refreshTokenTtl, {
        email: user.email,
        type: user.type,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        issuer: this.jwtConfigurations.issuer,
        secret: this.jwtConfigurations.secret,
        audience: this.jwtConfigurations.audience,
        expiresIn,
      },
    );
  }
}
