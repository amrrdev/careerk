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

    return {
      jobSeekers,
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
      skills: profile.jobSeekerSkills.map(({ skill, verified }) => ({
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

  async updateMyProfile(jobSeekerId: string, updateJobSeekerProfileDto: UpdateJobSeekerProfileDto) {
    try {
      await this.jobSeekerRepository.updateMyProfile(jobSeekerId, updateJobSeekerProfileDto);
    } catch {
      throw new NotFoundException('Profile not found, please complete your onboarding first');
    }
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
}
