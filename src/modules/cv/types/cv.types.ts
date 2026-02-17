import { Prisma } from 'generated/prisma/client';

export const cvKeySelect = {
  select: {
    key: true,
  },
} satisfies Prisma.CVDefaultArgs;

export const cvInfoSelect = {
  select: {
    fileName: true,
    mimeType: true,
    uploadedAt: true,
  },
} satisfies Prisma.CVDefaultArgs;

export const cvDownloadSelect = {
  select: {
    key: true,
    fileName: true,
    mimeType: true,
    uploadedAt: true,
  },
} satisfies Prisma.CVDefaultArgs;

export interface CreateCvData {
  jobSeekerId: string;
  key: string;
  fileName: string;
  mimeType: string;
}

export type CvKey = Prisma.CVGetPayload<typeof cvKeySelect>;
export type CvInfo = Prisma.CVGetPayload<typeof cvInfoSelect>;
export type CvDownload = Prisma.CVGetPayload<typeof cvDownloadSelect>;
