import { Prisma } from 'generated/prisma/client';
import { Job } from './jobs.types';

export type Bookmark = Prisma.JobBookmarkGetPayload<object>;

export type CreateBookmarkData = {
  jobId: string;
  jobSource: 'DIRECT' | 'SCRAPED';
};

export const bookmarkWithDetailsSelect = {
  select: {
    id: true,
    jobId: true,
    jobSource: true,
    createdAt: true,
  },
} satisfies Prisma.JobBookmarkDefaultArgs;

export type BookmarkWithDetails = Prisma.JobBookmarkGetPayload<typeof bookmarkWithDetailsSelect>;

export type BookmarkedJob = {
  bookmarkId: string;
  bookmarkedAt: Date;
  job: Job;
};
