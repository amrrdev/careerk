import { Prisma } from 'generated/prisma/client';

export const directJobNotificationSelect = {
  select: {
    title: true,
    company: {
      select: {
        email: true,
        isActive: true,
        name: true,
      },
    },
  },
} satisfies Prisma.DirectJobDefaultArgs;

export type DirectJobNotification = Prisma.DirectJobGetPayload<typeof directJobNotificationSelect>;

export const scrapedJobNotificationSelect = {
  select: {
    jobSeekerId: true,
    matchScore: true,
    jobSeeker: {
      select: {
        email: true,
        firstName: true,
      },
    },
    scrapedJob: {
      select: {
        title: true,
        companyName: true,
        location: true,
      },
    },
  },
} satisfies Prisma.ScrapedJobMatchDefaultArgs;

export type ScrapedJobNotification = Prisma.ScrapedJobMatchGetPayload<
  typeof scrapedJobNotificationSelect
>;

export const rawScrapedJobMatchSelect = {
  select: {
    id: true,
    scrapedJobId: true,
    matchScore: true,
    createdAt: true,
    scrapedJob: {
      select: {
        id: true,
        title: true,
        companyName: true,
        location: true,
      },
    },
  },
} satisfies Prisma.ScrapedJobMatchDefaultArgs;

export const rawDirectJobMatchForJobSeekerSelect = {
  select: {
    id: true,
    directJobId: true,
    matchScore: true,
    createdAt: true,
    directJob: {
      select: {
        id: true,
        title: true,
        location: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    },
  },
} satisfies Prisma.DirectJobMatchDefaultArgs;

export const rawDirectJobMatchForCompanySelect = {
  select: {
    id: true,
    matchScore: true,
    createdAt: true,
    jobSeeker: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profile: {
          select: {
            title: true,
            availabilityStatus: true,
            location: true,
          },
        },
      },
    },
  },
} satisfies Prisma.DirectJobMatchDefaultArgs;

export type RawScrapedJobMatch = Prisma.ScrapedJobMatchGetPayload<typeof rawScrapedJobMatchSelect>;

export type RawDirectJobMatchForJobSeeker = Prisma.DirectJobMatchGetPayload<
  typeof rawDirectJobMatchForJobSeekerSelect
>;

export type RawDirectJobMatchForCompany = Prisma.DirectJobMatchGetPayload<
  typeof rawDirectJobMatchForCompanySelect
>;

// ---------------- Response Types ----------------

export interface MatchItem {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  matchScore: number;
  jobSource: 'DIRECT' | 'SCRAPED';
  createdAt: Date;
}

export interface CompanyMatchItem {
  id: string;
  jobSeekerId: string;
  jobSeekerName: string;
  jobSeekerTitle: string;
  availabilityStatus: string;
  location: string;
  matchScore: number;
  createdAt: Date;
}

// ---------------- Pagination ----------------

export interface PaginatedResult<T> {
  matches: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
