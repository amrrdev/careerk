import { Prisma } from 'generated/prisma/client';

export const educationSelect = {
  select: {
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
