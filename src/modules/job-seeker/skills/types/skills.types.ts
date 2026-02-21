import { Prisma } from 'generated/prisma/client';

export const jobSeekerSkillWithNameSelect = {
  select: {
    skillId: true,
    verified: true,
    skill: {
      select: {
        name: true,
      },
    },
  },
} satisfies Prisma.JobSeekerSkillDefaultArgs;

export type JobSeekerSkillWithName = {
  skillId: string;
  verified: boolean;
  name: string;
};

export type CreateJobSeekerSkillData = {
  jobSeekerId: string;
  skillId: string;
  verified?: boolean;
};
