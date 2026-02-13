import { Prisma } from 'generated/prisma/client';

export type Skill = Prisma.SkillGetPayload<object>;

export type CreateSkillData = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateSkillData = Partial<Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>>;
