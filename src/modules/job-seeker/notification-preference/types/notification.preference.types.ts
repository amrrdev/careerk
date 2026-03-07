import { Prisma } from 'generated/prisma/client';

export const notificationPreferenceSelect = {
  select: {
    applicationStatusNotificationsEnabled: true,
    jobMatchNotificationsEnabled: true,
    updatedAt: true,
  },
} satisfies Prisma.JobSeekerNotificationPreferenceDefaultArgs;

export type NotificationPreference = Prisma.JobSeekerNotificationPreferenceGetPayload<
  typeof notificationPreferenceSelect
>;

export type UpdateNotificationPreference = {
  applicationStatusNotificationsEnabled?: boolean;
  jobMatchNotificationsEnabled?: boolean;
};
