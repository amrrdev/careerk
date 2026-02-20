export interface NlpParseCvRequest {
  cvUrl: string;
  jobSeekerId: string;
}

export interface NlpParseCvResponse {
  jobSeekerId: string;
  parsedAt: string;
  data: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      location?: string;
      linkedinUrl?: string;
      githubUrl?: string;
      portfolioUrl?: string;
    };
    professionalSummary: string;
    title: string;
    education: Array<{
      institutionName: string;
      degreeType: string;
      fieldOfStudy: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      gpa?: number;
      description?: string;
    }>;
    workExperience: Array<{
      companyName: string;
      jobTitle: string;
      location?: string;
      startDate: string;
      endDate?: string;
      isCurrent: boolean;
      description: string;
    }>;
    skills: Array<{
      name: string;
      verified: boolean;
    }>;
    expectedSalary?: number;
    workPreference?: string;
    yearsOfExperience?: number;
    noticePeriod?: string;
    availabilityStatus?: string;
  };
}
