import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { CompanySize, CompanyType } from 'generated/prisma/enums';

export class RegisterCompanyDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @MinLength(6)
  readonly password: string;

  @IsString()
  readonly industry: string;

  @IsEnum(CompanySize)
  readonly size: CompanySize;

  @IsEnum(CompanyType)
  readonly type: CompanyType;
}
