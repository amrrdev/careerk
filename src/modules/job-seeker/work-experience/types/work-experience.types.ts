import { Prisma } from 'generated/prisma/client';

export const workExperienceSelect = {
  select: {
    id: true,
    companyName: true,
    jobTitle: true,
    description: true,
    location: true,
    startDate: true,
    endDate: true,
    isCurrent: true,
  },
} satisfies Prisma.WorkExperienceDefaultArgs;

export type WorkExperience = Prisma.WorkExperienceGetPayload<typeof workExperienceSelect>;

export type CreateWorkExperienceData = {
  companyName: string;
  jobTitle: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
};

export type UpdateWorkExperienceData = Partial<CreateWorkExperienceData>;
