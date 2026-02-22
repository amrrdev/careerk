import { PartialType } from '@nestjs/mapped-types';
import { CreateDirectJobDto } from './create-direct-job.dto';

export class UpdateDirectJobDto extends PartialType(CreateDirectJobDto) {}
