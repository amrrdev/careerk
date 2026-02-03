import { Prisma } from 'generated/prisma/client';

/**
 * Base Company type from Prisma
 */
export type Company = Prisma.CompanyGetPayload<object>;

/**
 * Company without sensitive fields (for public profiles)
 */
export type PublicCompany = Omit<Company, 'password' | 'isActive' | 'isVerified'>;

/**
 * Company creation data
 */

// export type CreateCompanyData = Omit<
//   Company,
//   'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isVerified'
// >;

// TODO: idk, companies might want to provide them during registration:
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

/**
 * Company update data
 */
export type UpdateCompanyData = Partial<
  Omit<Company, 'id' | 'password' | 'email' | 'createdAt' | 'updatedAt' | 'isActive'>
>;
