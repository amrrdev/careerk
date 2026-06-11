import { ApplicationStatusEnum, Prisma } from 'generated/prisma/client';

export type Application = Prisma.ApplicationGetPayload<object>;

export const applicationListSelect = {
  select: {
    id: true,
    status: true,
    appliedAt: true,
    updatedAt: true,
    directJob: {
      select: {
        id: true,
        title: true,
        location: true,
        jobType: true,
        workPreference: true,
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    },
  },
} satisfies Prisma.ApplicationDefaultArgs;

export type ApplicationListItem = Prisma.ApplicationGetPayload<typeof applicationListSelect> & {
  matchScore?: number;
};

export const applicationDetailSelect = {
  select: {
    id: true,
    status: true,
    appliedAt: true,
    updatedAt: true,
    directJob: {
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        responsibilities: true,
        location: true,
        jobType: true,
        workPreference: true,
        experienceLevel: true,
        salaryMin: true,
        salaryMax: true,
        skills: {
          select: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            description: true,
            industry: true,
            size: true,
            websiteUrl: true,
            linkedIn: true,
          },
        },
      },
    },
  },
} satisfies Prisma.ApplicationDefaultArgs;

export type ApplicationDetail = Prisma.ApplicationGetPayload<typeof applicationDetailSelect> & {
  matchScore?: number;
};

export type ApplicationFilters = {
  status?: ApplicationStatusEnum[];
  search?: string;
  dateApplied?: 'Last 24 hours' | 'Last 7 days' | 'Last 30 days' | 'All time';
  page?: number;
  limit?: number;
};

export type PaginatedApplications = {
  applications: ApplicationListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
