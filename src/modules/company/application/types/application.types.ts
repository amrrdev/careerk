import { ApplicationStatusEnum, Prisma } from 'generated/prisma/client';

export type Application = Prisma.ApplicationGetPayload<object>;

export type UpdateApplicationData = {
  status: ApplicationStatusEnum;
};

// List view for companies
export const applicationListSelect = {
  select: {
    id: true,
    status: true,
    appliedAt: true,
    updatedAt: true,
    jobSeeker: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        profile: {
          select: {
            title: true,
            yearsOfExperience: true,
            location: true,
          },
        },
      },
    },
    directJob: {
      select: {
        id: true,
        title: true,
        location: true,
        jobType: true,
      },
    },
  },
} satisfies Prisma.ApplicationDefaultArgs;

export type ApplicationListItem = Prisma.ApplicationGetPayload<typeof applicationListSelect>;

// Detail view for companies
export const applicationDetailSelect = {
  select: {
    id: true,
    status: true,
    appliedAt: true,
    updatedAt: true,
    jobSeeker: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImageUrl: true,
        profile: {
          select: {
            title: true,
            yearsOfExperience: true,
            location: true,
            phone: true,
            summary: true,
            linkedinUrl: true,
            portfolioUrl: true,
            githubUrl: true,
            cvEmail: true,
            availabilityStatus: true,
            workPreference: true,
            expectedSalary: true,
          },
        },
        educations: {
          select: {
            institutionName: true,
            degreeType: true,
            fieldOfStudy: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
            gpa: true,
          },
          orderBy: { startDate: 'desc' },
        },
        workExperiences: {
          select: {
            companyName: true,
            jobTitle: true,
            location: true,
            startDate: true,
            endDate: true,
            isCurrent: true,
            description: true,
          },
          orderBy: { startDate: 'desc' },
        },
        jobSeekerSkills: {
          select: {
            skill: {
              select: {
                id: true,
                name: true,
              },
            },
            verified: true,
          },
        },
      },
    },
    directJob: {
      select: {
        id: true,
        title: true,
        description: true,
        requirements: true,
        responsibilities: true,
        location: true,
        jobType: true,
        workPreference: true,
        experienceLevel: true,
        salaryMin: true,
        salaryMax: true,
      },
    },
  },
} satisfies Prisma.ApplicationDefaultArgs;

export type ApplicationDetail = Prisma.ApplicationGetPayload<typeof applicationDetailSelect>;

export type ApplicationFilters = {
  jobId?: string;
  status?: ApplicationStatusEnum;
  page?: number;
  limit?: number;
};

export type PaginatedApplications = {
  applications: ApplicationListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
