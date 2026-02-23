import { Prisma } from 'generated/prisma/client';
import { CompanySize, CompanyType } from 'generated/prisma/enums';

export type Company = Prisma.CompanyGetPayload<object>;

export type PublicCompany = Omit<
  Company,
  'password' | 'email' | 'isActive' | 'isVerified' | 'createdAt' | 'updatedAt'
>;

export const publicCompanySelect = {
  select: {
    id: true,
    name: true,
    description: true,
    logoUrl: true,
    coverUrl: true,
    industry: true,
    size: true,
    type: true,
    headquartersLocation: true,
    foundedYear: true,
    websiteUrl: true,
    benefits: true,
    linkedIn: true,
    facebook: true,
    twitter: true,
  },
} satisfies Prisma.CompanyDefaultArgs;

export type PublicCompanyListItem = Prisma.CompanyGetPayload<typeof publicCompanySelect>;

export const publicCompanyDetailsSelect = {
  select: {
    id: true,
    name: true,
    description: true,
    logoUrl: true,
    coverUrl: true,
    industry: true,
    size: true,
    type: true,
    headquartersLocation: true,
    foundedYear: true,
    websiteUrl: true,
    benefits: true,
    linkedIn: true,
    facebook: true,
    twitter: true,
    createdAt: true,
    directJobs: {
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        location: true,
        jobType: true,
        workPreference: true,
        experienceLevel: true,
        status: true,
      },
      take: 5,
    },
  },
} satisfies Prisma.CompanyDefaultArgs;

export type PublicCompanyDetails = Prisma.CompanyGetPayload<typeof publicCompanyDetailsSelect>;

export const myCompanyProfileSelect = {
  select: {
    id: true,
    email: true,
    name: true,
    description: true,
    logoUrl: true,
    coverUrl: true,
    industry: true,
    size: true,
    type: true,
    headquartersLocation: true,
    foundedYear: true,
    websiteUrl: true,
    benefits: true,
    linkedIn: true,
    facebook: true,
    twitter: true,
  },
} satisfies Prisma.CompanyDefaultArgs;

export type MyCompanyProfile = Prisma.CompanyGetPayload<typeof myCompanyProfileSelect>;

export type CreateCompanyData = Omit<
  Company,
  | 'id'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'isActive'
  | 'isVerified'
  | 'logoUrl'
  | 'coverUrl'
  | 'headquartersLocation'
  | 'foundedYear'
  | 'websiteUrl'
  | 'benefits'
  | 'linkedIn'
  | 'facebook'
  | 'twitter'
>;

export type UpdateCompanyData = Partial<
  Omit<Company, 'id' | 'password' | 'email' | 'createdAt' | 'updatedAt' | 'isActive'>
>;

export type CompanyFilters = {
  name?: string;
  industry?: string;
  size?: CompanySize;
  type?: CompanyType;
  location?: string;
  isVerified?: boolean;
  page?: number;
  limit?: number;
};
