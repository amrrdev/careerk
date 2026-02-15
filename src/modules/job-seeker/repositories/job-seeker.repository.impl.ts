import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CreateJobSeekerData, JobSeeker, UpdateJobSeekerData } from '../types/job-seeker.types';
import { JobSeekerRepository } from './job-seeker.repository';
import {
  JobSeekerProfileFilters,
  MyJobSeekerProfileDetails,
  UpdateMyProfileData,
} from '../types/job-seeker-profile.types';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class JobSeekerRepositoryImpl implements JobSeekerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateMyProfile(jobSeekerId: string, data: UpdateMyProfileData): Promise<void> {
    const { firstName, lastName, ...profileData } = data;

    return this.databaseService.$transaction(async (tx) => {
      if (firstName || lastName) {
        await tx.jobSeeker.update({
          where: { id: jobSeekerId },
          data: { firstName, lastName },
        });
      }

      if (Object.keys(profileData).length > 0) {
        await tx.jobSeekerProfile.update({
          where: { jobSeekerId },
          data: profileData,
        });
      }
    });
  }

  // It should contains the cv
  findMyProfile(jobSeekerId: string): Promise<MyJobSeekerProfileDetails | null> {
    return this.databaseService.jobSeeker.findUnique({
      where: { id: jobSeekerId },
      select: {
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        profile: {
          select: {
            jobSeekerId: true,
            title: true,
            location: true,
            availabilityStatus: true,
            workPreference: true,
            preferredJobTypes: true,
            yearsOfExperience: true,
            linkedinUrl: true,
            portfolioUrl: true,
            githubUrl: true,
            cvEmail: true,
            noticePeriod: true,
            phone: true,
            expectedSalary: true,
            summary: true,
          },
        },
        educations: {
          select: {
            degreeType: true,
            description: true,
            institutionName: true,
            isCurrent: true,
            fieldOfStudy: true,
            endDate: true,
            gpa: true,
            startDate: true,
          },
        },
        workExperiences: {
          select: {
            companyName: true,
            description: true,
            isCurrent: true,
            startDate: true,
            jobTitle: true,
            location: true,
            endDate: true,
          },
        },
        jobSeekerSkills: {
          select: {
            skill: true,
            verified: true,
          },
        },
      },
    });
  }

  async deactivateByEmail(email: string): Promise<{ id: string } | null> {
    return await this.databaseService.jobSeeker.update({
      where: { email },
      data: { isActive: false },
      select: { id: true },
    });
  }

  async findAllProfiles(filters: JobSeekerProfileFilters) {
    const {
      availabilityStatus,
      location,
      workPreference,
      minYearsOfExperience,
      maxYearsOfExperience,
      preferredJobTypes,
      maxNoticePeriod,
      page = 1,
      limit = 20,
    } = filters;

    const where: Prisma.JobSeekerProfileWhereInput = {
      jobSeeker: { isActive: true, isVerified: true },
    };
    if (availabilityStatus) where.availabilityStatus = availabilityStatus;
    if (workPreference) where.workPreference = workPreference;
    if (location) where.location = location;
    if (maxNoticePeriod !== undefined) where.noticePeriod = { lte: maxNoticePeriod };
    if (preferredJobTypes?.length) where.preferredJobTypes = { hasSome: preferredJobTypes };
    if (minYearsOfExperience !== undefined || maxYearsOfExperience !== undefined) {
      where.yearsOfExperience = {};
      if (minYearsOfExperience !== undefined) where.yearsOfExperience.gte = minYearsOfExperience;
      if (maxYearsOfExperience !== undefined) where.yearsOfExperience.lte = maxYearsOfExperience;
    }

    const [jobSeekers, total] = await this.databaseService.$transaction([
      this.databaseService.jobSeeker.findMany({
        where: {
          profile: where,
        },
        select: {
          firstName: true,
          lastName: true,
          profile: {
            select: {
              jobSeekerId: true,
              title: true,
              location: true,
              availabilityStatus: true,
              workPreference: true,
              preferredJobTypes: true,
              yearsOfExperience: true,
              linkedinUrl: true,
              portfolioUrl: true,
              githubUrl: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { profile: { yearsOfExperience: 'desc' } },
      }),

      this.databaseService.jobSeekerProfile.count({ where }),
    ]);

    return {
      jobSeekers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findProfileById(jobSeekerId: string) {
    return this.databaseService.jobSeeker.findUnique({
      where: { id: jobSeekerId },
      select: {
        firstName: true,
        lastName: true,
        profileImageUrl: true,
        profile: {
          select: {
            jobSeekerId: true,
            title: true,
            location: true,
            availabilityStatus: true,
            workPreference: true,
            preferredJobTypes: true,
            yearsOfExperience: true,
            linkedinUrl: true,
            portfolioUrl: true,
            githubUrl: true,
            cvEmail: true,
            noticePeriod: true,
            phone: true,
            expectedSalary: true,
            summary: true,
          },
        },
        educations: {
          select: {
            degreeType: true,
            description: true,
            institutionName: true,
            isCurrent: true,
            fieldOfStudy: true,
            endDate: true,
            gpa: true,
            startDate: true,
          },
        },
        workExperiences: {
          select: {
            companyName: true,
            description: true,
            isCurrent: true,
            startDate: true,
            jobTitle: true,
            location: true,
            endDate: true,
          },
        },
        jobSeekerSkills: {
          select: {
            skill: true,
            verified: true,
          },
        },
      },
    });
  }

  async findByEmailAndUpdatePassword(
    email: string,
    password: string,
  ): Promise<{ id: string } | null> {
    try {
      return await this.databaseService.jobSeeker.update({
        where: { email },
        data: { password },
        select: { id: true },
      });
    } catch {
      return null;
    }
  }

  async findByEmailAndUpdate(email: string, data: UpdateJobSeekerData): Promise<JobSeeker | null> {
    try {
      return await this.databaseService.jobSeeker.update({
        where: { email },
        data,
      });
    } catch {
      return null;
    }
  }

  async findByEmail(email: string): Promise<JobSeeker | null> {
    return this.databaseService.jobSeeker.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<JobSeeker | null> {
    return this.databaseService.jobSeeker.findUnique({ where: { id } });
  }

  async create(data: CreateJobSeekerData): Promise<JobSeeker> {
    return this.databaseService.jobSeeker.create({ data });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.databaseService.jobSeeker.findUnique({
      where: { email },
      select: { id: true },
    });
    return result !== null;
  }
}
