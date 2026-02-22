import {
  DirectJobStatusEnum,
  ExperienceLevelEnum,
  JobTypeEnum,
  Prisma,
  WorkPreferenceEnum,
} from 'generated/prisma/client';

export const directJobSelect = {
  select: {
    id: true,
    title: true,
    description: true,
    requirements: true,
    responsibilities: true,
    location: true,
    salaryMin: true,
    salaryMax: true,
    jobType: true,
    workPreference: true,
    experienceLevel: true,
    status: true,
    deadline: true,
    publishedAt: true,
    company: {
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
    },
    skills: {
      include: {
        skill: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
} satisfies Prisma.DirectJobDefaultArgs;

export type DirectJob = Prisma.DirectJobGetPayload<typeof directJobSelect>;

export type DirectJobSkill = {
  skillId: string;
  name: string;
};

export type DirectJobWithSkills = Omit<DirectJob, 'skills'> & {
  skills: DirectJobSkill[];
};

export function transformDirectJob(job: DirectJob): DirectJobWithSkills {
  return {
    ...job,
    skills: job.skills.map((s) => ({
      skillId: s.skill.id,
      name: s.skill.name,
    })),
  };
}

export function transformDirectJobs(jobs: DirectJob[]): DirectJobWithSkills[] {
  return jobs.map(transformDirectJob);
}

export type CreateDirectJobData = {
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: JobTypeEnum;
  workPreference: WorkPreferenceEnum;
  experienceLevel: ExperienceLevelEnum;
  status: DirectJobStatusEnum;
  deadline?: Date;
  skillNames?: string[];
};
export type UpdateDirectJobData = Partial<CreateDirectJobData>;
