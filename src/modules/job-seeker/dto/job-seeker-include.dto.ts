import { Transform } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

const VALID_INCLUDES = ['educations', 'workExperiences', 'skills'] as const;
type ValidInclude = (typeof VALID_INCLUDES)[number];

export class JobSeekerIncludeDto {
  @IsOptional()
  @IsIn(VALID_INCLUDES, { each: true })
  @Transform(({ value }: { value: string | string[] }) => {
    if (!value) return undefined;
    const arr = Array.isArray(value) ? value : value.split(',');
    return arr.map((v) => v.trim()) as ValidInclude[];
  })
  includes?: ValidInclude[];
}
