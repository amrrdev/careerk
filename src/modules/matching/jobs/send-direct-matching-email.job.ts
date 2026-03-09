export type SendDirectMatchingEmailJob = {
  companyEmail: string;
  companyName: string;
  jobTitle: string;
  matchedCandidates: number;
  processedCandidates: number;
  requestId: string;
  finishedAt: string;
};
