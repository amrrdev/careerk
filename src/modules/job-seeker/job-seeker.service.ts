import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MediaStorageService } from 'src/infrastructure/media-storage/media-storage.service';
import { JobSeekerRepository } from './repositories/job-seeker.repository';
import { JobSeekerQueryDto } from './dto/job-seeker-query.dto';
import { UpdateJobSeekerProfileDto } from './dto/update-job-seeker-profile.dto';
import { RequestProfileImageUploadDto } from './dto/request-profile-image-upload.dto';
import { ConfirmProfileImageUploadDto } from './dto/confirm-profile-image-upload.dto';

@Injectable()
export class JobSeekerService {
  constructor(
    private readonly jobSeekerRepository: JobSeekerRepository,
    private readonly mediaStorageService: MediaStorageService,
  ) {}

  async findAllProfiles(query: JobSeekerQueryDto) {
    const { page = 1, limit = 20 } = query;
    const { jobSeekers, total } = await this.jobSeekerRepository.findAllProfiles(query);

    // ADDED: transform public job seeker response to include skills + email field

    return {
      jobSeekers: jobSeekers.map((jobSeeker) => ({
        firstName: jobSeeker.firstName,
        lastName: jobSeeker.lastName,
        profileImageUrl: jobSeeker.profileImageUrl,

        profile: {
          ...jobSeeker.profile,

          // RENAMED
          email: jobSeeker.email,

          // ADDED
          cvScore: jobSeeker.skillGapAnalyses[0]?.cvScore ?? null,
        },

        skills: jobSeeker.jobSeekerSkills.map(({ skill, verified }) => ({
          name: skill.name,
          verified,
        })),
      })),

      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMyProfile(jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!profile) {
      throw new NotFoundException(`Job seeker profile not found`);
    }

    return {
      ...profile,
      skills: profile.jobSeekerSkills.map(({ skill, skillId, verified }) => ({
        //Added
        skillId,
        name: skill.name,
        verified,
      })),
      jobSeekerSkills: undefined,
    };
  }

  async findProfileById(jobSeekerId: string) {
    const profile = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!profile) {
      throw new NotFoundException(`Job seeker profile not found`);
    }

    return {
      ...profile,
      skills: profile.jobSeekerSkills.map(({ skill, verified }) => ({
        name: skill.name,
        verified,
      })),
      jobSeekerSkills: undefined,
    };
  }
  // Edited to return only updated fields instead of entire profile
  async updateMyProfile(jobSeekerId: string, dto: UpdateJobSeekerProfileDto) {
    const oldProfile = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!oldProfile) {
      throw new NotFoundException('Profile not found');
    }

    await this.jobSeekerRepository.updateMyProfile(jobSeekerId, dto);

    const changedFields: Record<string, unknown> = {};

    // JobSeeker fields
    const rootFields: (keyof UpdateJobSeekerProfileDto)[] = [
      'firstName',
      'lastName',
      'profileImageUrl',
    ];

    for (const field of rootFields) {
      if (dto[field] !== undefined && dto[field] !== oldProfile[field as keyof typeof oldProfile]) {
        changedFields[field] = dto[field];
      }
    }

    const oldP = oldProfile.profile;

    if (!oldP) {
      throw new NotFoundException('Profile not found, please complete your onboarding first');
    }

    const profileFields: (keyof UpdateJobSeekerProfileDto)[] = [
      'title',
      'location',
      'summary',
      'githubUrl',
      'linkedinUrl',
      'portfolioUrl',
      'expectedSalary',
      'yearsOfExperience',
      'availabilityStatus',
      'workPreference',
      'preferredJobTypes',
    ];

    for (const field of profileFields) {
      if (dto[field] === undefined) continue;

      const oldValue = oldP[field as keyof typeof oldP];
      const newValue = dto[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changedFields[field] = newValue;
      }
    }

    return {
      success: true,
      data: changedFields,
    };
  }

  async deactivate(email: string) {
    return await this.jobSeekerRepository.deactivateByEmail(email);
  }

  async requestProfileImageUpload(
    jobSeekerId: string,
    requestProfileImageUploadDto: RequestProfileImageUploadDto,
  ) {
    const key = this.mediaStorageService.buildJobSeekerProfileImageKey(
      jobSeekerId,
      requestProfileImageUploadDto.fileName,
    );

    const uploadUrl = await this.mediaStorageService.generateUploadUrl(
      key,
      requestProfileImageUploadDto.mimeType,
    );

    return {
      uploadUrl,
      key,
      fileUrl: this.mediaStorageService.buildFileUrl(key),
    };
  }

  async confirmProfileImageUpload(
    jobSeekerId: string,
    confirmProfileImageUploadDto: ConfirmProfileImageUploadDto,
  ) {
    const expectedPrefix = `profile-images/${jobSeekerId}/`;
    if (!confirmProfileImageUploadDto.key.startsWith(expectedPrefix)) {
      throw new BadRequestException('Invalid profile image key');
    }

    const exists = await this.mediaStorageService.fileExists(confirmProfileImageUploadDto.key);
    if (!exists) {
      throw new BadRequestException('File not found in storage, upload may have failed');
    }

    const currentProfile = await this.jobSeekerRepository.findMyProfile(jobSeekerId);
    if (!currentProfile) {
      throw new NotFoundException('Job seeker profile not found');
    }

    const fileUrl = this.mediaStorageService.buildFileUrl(confirmProfileImageUploadDto.key);
    const previousKey =
      currentProfile.profileImageUrl &&
      currentProfile.profileImageUrl !== fileUrl &&
      this.mediaStorageService.extractKeyFromFileUrl(currentProfile.profileImageUrl);

    if (previousKey) {
      await this.mediaStorageService.deleteFile(previousKey);
    }

    await this.jobSeekerRepository.updateMyProfile(jobSeekerId, { profileImageUrl: fileUrl });

    return {
      fileUrl,
    };
  }
  // Added: Job seeker overview service method
  async getOverview(jobSeekerId: string) {
    const jobSeeker = await this.jobSeekerRepository.findProfileById(jobSeekerId);

    if (!jobSeeker) {
      throw new NotFoundException('Job seeker profile does not exist');
    }

    const [savedJobsCount, directMatches, scrapedMatches] = await Promise.all([
      this.jobSeekerRepository.countSavedJobs(jobSeekerId),
      this.jobSeekerRepository.countDirectMatches(jobSeekerId),
      this.jobSeekerRepository.countScrapedMatches(jobSeekerId),
    ]);

    return {
      firstName: jobSeeker.firstName,
      lastName: jobSeeker.lastName,

      hasProfile: !!jobSeeker.profile,

      profileImageUrl: jobSeeker.profileImageUrl || '',
      linkedIn: jobSeeker.profile?.linkedinUrl || '',
      github: jobSeeker.profile?.githubUrl || '',

      savedJobsCount,
      recommendedJobsCount: directMatches + scrapedMatches,
    };
  }
}
