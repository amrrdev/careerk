export type SendScrapedMatchingEmailJob = {
  email: string;
  firstName: string;
  totalMatches: number;
  since: string;
  until: string;
  topMatches: {
    title: string;
    companyName: string;
    location: string | null;
    matchScore: number;
  }[];
};
