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
