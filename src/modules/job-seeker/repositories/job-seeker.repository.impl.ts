import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { CreateJobSeekerData, JobSeeker, UpdateJobSeekerData } from '../types/job-seeker.types';
import { JobSeekerRepository } from './job-seeker.repository';
import {
  JobSeekerProfileFilters,
  myJobSeekerProfileDetails,
  MyJobSeekerProfileDetails,
  publicJobSeekerProfileDetails,
  publicProfileSelect,
  UpdateMyProfileData,
} from '../types/job-seeker-profile.types';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class JobSeekerRepositoryImpl implements JobSeekerRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async updateMyProfile(jobSeekerId: string, data: UpdateMyProfileData): Promise<void> {
    const { firstName, lastName, profileImageUrl, ...profileData } = data;

    const jobSeekerData: Prisma.JobSeekerUpdateInput = {};
    if (firstName !== undefined) jobSeekerData.firstName = firstName;
    if (lastName !== undefined) jobSeekerData.lastName = lastName;
    if (profileImageUrl !== undefined) jobSeekerData.profileImageUrl = profileImageUrl;

    const hasJobSeekerUpdate = Object.keys(jobSeekerData).length > 0;
    const hasProfileUpdate = Object.keys(profileData).length > 0;

    if (!hasJobSeekerUpdate && !hasProfileUpdate) return;

    await this.databaseService.$transaction(async (tx) => {
      const exists = await tx.jobSeeker.findUnique({
        where: { id: jobSeekerId },
        select: { id: true },
      });

      if (!exists) throw new NotFoundException('Job seeker not found');

      if (hasJobSeekerUpdate) {
        await tx.jobSeeker.update({
          where: { id: jobSeekerId },
          data: jobSeekerData,
        });
      }

      if (hasProfileUpdate) {
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
      ...myJobSeekerProfileDetails,
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
      search,
      page = 1,
      limit = 20,
    } = filters;

    const profileWhere: Prisma.JobSeekerProfileWhereInput = {};

    if (availabilityStatus?.length) profileWhere.availabilityStatus = { in: availabilityStatus };
    if (workPreference?.length) profileWhere.workPreference = { in: workPreference };
    if (location) profileWhere.location = location;
    if (maxNoticePeriod !== undefined) profileWhere.noticePeriod = { lte: maxNoticePeriod };
    if (preferredJobTypes?.length) profileWhere.preferredJobTypes = { hasSome: preferredJobTypes };
    if (minYearsOfExperience !== undefined || maxYearsOfExperience !== undefined) {
      profileWhere.yearsOfExperience = {};
      if (minYearsOfExperience !== undefined)
        profileWhere.yearsOfExperience.gte = minYearsOfExperience;
      if (maxYearsOfExperience !== undefined)
        profileWhere.yearsOfExperience.lte = maxYearsOfExperience;
    }

    const where: Prisma.JobSeekerWhereInput = {
      isActive: true,
      isVerified: true,
    };

    where.profile = Object.keys(profileWhere).length > 0 ? profileWhere : { is: {} };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { profile: { title: { contains: search, mode: 'insensitive' } } },
        {
          jobSeekerSkills: {
            some: { skill: { name: { contains: search, mode: 'insensitive' } } },
          },
        },
      ];
    }

    const [jobSeekers, total] = await this.databaseService.$transaction([
      this.databaseService.jobSeeker.findMany({
        where,
        ...publicProfileSelect,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { profile: { yearsOfExperience: 'desc' } },
      }),

      this.databaseService.jobSeeker.count({ where }),
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
      ...publicJobSeekerProfileDetails,
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
  // 3 new methods for overview endpoint
  async countSavedJobs(jobSeekerId: string): Promise<number> {
    return this.databaseService.jobBookmark.count({
      where: { jobSeekerId },
    });
  }
  async countDirectMatches(jobSeekerId: string): Promise<number> {
    return this.databaseService.directJobMatch.count({
      where: { jobSeekerId },
    });
  }
  async countScrapedMatches(jobSeekerId: string): Promise<number> {
    return this.databaseService.scrapedJobMatch.count({
      where: { jobSeekerId },
    });
  }
}
