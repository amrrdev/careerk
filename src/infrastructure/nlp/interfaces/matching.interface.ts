export interface DirectJobMacthingRequest {
  jobId: string;
}

export interface DirectJobMatchingAcceptedResponse {
  type: 'direct';
  status: 'accepted';
  jobId: string;
  acceptedAt: Date;
}

export interface JobSeekerMatchingRequest {
  jobSeekerId: string;
  requestId?: string;
  scrapedLookbackDays?: number;
}

export interface JobSeekerMatchingAcceptedResponse {
  type: 'job-seeker';
  status: 'accepted';
  requestId: string;
  jobSeekerId: string;
  scrapedLookbackDays: number;
  acceptedAt: string;
}
