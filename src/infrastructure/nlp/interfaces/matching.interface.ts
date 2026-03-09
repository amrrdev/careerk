export interface DirectJobMacthingRequest {
  jobId: string;
}

export interface DirectJobMatchingAcceptedResponse {
  type: 'direct';
  status: 'accepted';
  jobId: string;
  acceptedAt: Date;
}
