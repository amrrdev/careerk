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
//Edited to include additional fields
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
        description: true,
        location: true,
        salary: true,
        jobType: true,
        companyName: true,
        url: true,
        source: true,
        postedAt: true,

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
      },
    },
  },
} satisfies Prisma.ScrapedJobMatchDefaultArgs;
//Edited to include additional fields
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
        description: true,
        requirements: true,
        responsibilities: true,
        location: true,
        salaryMin: true,
        salaryMax: true,
        jobType: true,
        workPreference: true,
        experienceLevel: true,
        publishedAt: true,

        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            industry: true,
          },
        },

        applications: {
          select: {
            id: true,
          },
        },

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

//Edited to include additional fields
export interface MatchItem {
  id: string;

  type: 'direct' | 'scraped';

  title: string;
  description: string | null;

  location: string;

  jobType: string | null;

  matchScore: number;

  // DIRECT ONLY
  requirements?: string | null;
  responsibilities?: string | null;

  salaryMin?: number | null;
  salaryMax?: number | null;

  workPreference?: string | null;
  experienceLevel?: string | null;

  company?: {
    id: string;
    name: string;
    logoUrl: string | null;
    industry: string;
  };

  publishedAt?: Date | null;

  applicants?: number;

  // SCRAPED ONLY
  salary?: string | null;

  companyName?: string;

  sourceUrl?: string;
  source?: string;

  postedAt?: Date | null;

  // COMMON
  skills: {
    skillId: string;
    name: string;
  }[];
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
