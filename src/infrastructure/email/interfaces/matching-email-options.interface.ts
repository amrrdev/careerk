export type DirectMatchingCompletedEmailOptions = {
  companyEmail: string;
  companyName: string;
  jobTitle: string;
  matchedCandidates: number;
  processedCandidates: number;
  requestId: string;
  finishedAt: string;
};

export type ScrapedMatchingCompletedEmailOptions = {
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
