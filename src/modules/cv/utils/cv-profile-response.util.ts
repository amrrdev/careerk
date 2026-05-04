import { NlpParseCvResponse } from '../cv-parse-result/types/cv-parse-result.types';

type ParsedCvData = NlpParseCvResponse['data'];

export function mapParsedCvToJobSeekerProfileShape(jobSeekerId: string, parsedData: ParsedCvData) {
  return {
    firstName: parsedData.personalInfo?.firstName ?? null,
    lastName: parsedData.personalInfo?.lastName ?? null,
    profileImageUrl: null,
    profile: {
      jobSeekerId,
      title: parsedData.title ?? null,
      location: parsedData.personalInfo?.location ?? null,
      availabilityStatus: parsedData.availabilityStatus ?? null,
      workPreference: parsedData.workPreference ?? null,
      preferredJobTypes: null,
      yearsOfExperience: parsedData.yearsOfExperience ?? null,
      linkedinUrl: parsedData.personalInfo?.linkedinUrl ?? null,
      portfolioUrl: parsedData.personalInfo?.portfolioUrl ?? null,
      githubUrl: parsedData.personalInfo?.githubUrl ?? null,
      cvEmail: parsedData.personalInfo?.email ?? null,
      noticePeriod: toNumberOrNull(parsedData.noticePeriod),
      phone: parsedData.personalInfo?.phone ?? null,
      expectedSalary: parsedData.expectedSalary ?? null,
      summary: parsedData.professionalSummary ?? parsedData.title ?? null,
    },
    educations: (parsedData.education || []).map((education) => ({
      degreeType: education.degreeType,
      description: education.description ?? null,
      institutionName: education.institutionName,
      isCurrent: education.isCurrent,
      fieldOfStudy: education.fieldOfStudy,
      endDate: education.endDate ?? null,
      gpa: education.gpa ?? null,
      startDate: education.startDate,
    })),
    workExperiences: (parsedData.workExperience || []).map((workExperience) => ({
      companyName: workExperience.companyName,
      description: workExperience.description,
      isCurrent: workExperience.isCurrent,
      startDate: workExperience.startDate,
      jobTitle: workExperience.jobTitle,
      location: workExperience.location ?? null,
      endDate: workExperience.endDate ?? null,
    })),
    skills: (parsedData.skills || []).map((skill: { name: string }) => ({
      name: skill.name,
      verified: true,
    })),
  };
}

export function buildEmptyJobSeekerProfileShape() {
  return {
    firstName: null,
    lastName: null,
    profileImageUrl: null,
    profile: null,
    educations: [],
    workExperiences: [],
    skills: [],
  };
}

function toNumberOrNull(value: string | number | undefined): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
}
