import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterJobSeekerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
