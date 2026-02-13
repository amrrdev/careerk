import { Prisma } from 'generated/prisma/client';

export type JobSeekerSkill = Prisma.JobSeekerSkillGetPayload<object>;

export type CreateJobSeekerSkillData = Pick<JobSeekerSkill, 'skillId'>;

export type UpdateJobSeekerSkillData = Pick<JobSeekerSkill, 'verified'>;
