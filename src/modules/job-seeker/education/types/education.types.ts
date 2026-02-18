import { DegreeTypeEnum, Prisma } from 'generated/prisma/client';

export const educationSelect = {
  select: {
    id: true,
    institutionName: true,
    description: true,
    fieldOfStudy: true,
    degreeType: true,
    isCurrent: true,
    gpa: true,
    startDate: true,
    endDate: true,
  },
} satisfies Prisma.EducationDefaultArgs;

export type Education = Prisma.EducationGetPayload<typeof educationSelect>;

export type CreateEducationData = {
  institutionName: string;
  degreeType: DegreeTypeEnum;
  fieldOfStudy: string;
  description?: string;
  gpa?: number;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
};

export type UpdateEducationData = Partial<CreateEducationData>;
