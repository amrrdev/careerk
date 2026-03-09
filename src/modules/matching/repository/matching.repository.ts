export type DirectJobNotificationTarget = {
  companyEmail: string;
  companyName: string;
  jobTitle: string;
};

export type ScrapedJobMatchPreview = {
  title: string;
  companyName: string;
  location: string | null;
  matchScore: number;
};

export type ScrapedJobNotificationTarget = {
  email: string;
  firstName: string;
  totalMatches: number;
  topMatches: ScrapedJobMatchPreview[];
};

export abstract class MatchingRepository {
  abstract findDirectJobNotificationTarget(
    jobId: string,
  ): Promise<DirectJobNotificationTarget | null>;

  abstract findScrapedJobNotificationTargets(
    startedAt: Date,
    finishedAt: Date,
  ): Promise<ScrapedJobNotificationTarget[]>;
}
