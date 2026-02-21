import { IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class AddSkillsDto {
  @IsOptional()
  @IsUUID()
  skillId?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  skillIds?: string[];

  @IsOptional()
  @IsString()
  skillName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillNames?: string[];
}
