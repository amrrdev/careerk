import { ApplicationStatusEnum } from 'generated/prisma/enums';

export interface UpdateApplicationStatus {
  firstName: string;
  jobSeekerEmail: string;
  status: ApplicationStatusEnum;
}
