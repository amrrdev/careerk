import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CvParseResultRepository } from './cv-parse-result/repository/cv-parse-result.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { ConfirmParsedDataDto } from './dto/confirm-parsed-data.dto';

@Injectable()
export class CvParseService {
  constructor(
    private readonly cvParseResultRepository: CvParseResultRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async getPreview(jobSeekerId: string) {
    const result = await this.cvParseResultRepository.findByJobSeekerId(jobSeekerId);
    if (!result) {
      throw new NotFoundException('No CV parse result found. Please upload a CV first.');
    }
    if (result.status === 'PENDING') {
      return {
        status: result.status,
        message: 'Your CV is being processed. Please wait...',
      };
    }
    if (result.status === 'FAILED') {
      return {
        status: 'FAILED',
        message: result.errorMessage || 'Failed to parse CV',
      };
    }

    if (result.status === 'CONFIRMED') {
      return {
        status: 'CONFIRMED',
        message: 'CV data has already been saved to your profile',
      };
    }
    const parsedData = result.parsedData as Record<string, unknown>;
    const skillsArray = Array.isArray(parsedData.skills) ? (parsedData.skills as unknown[]) : [];
    const skills = skillsArray.map((s) => {
      const item = s as { name?: unknown };
      const name = typeof item.name === 'string' ? item.name : String(item.name ?? s);
      return { name, verified: true };
    });
    return {
      status: 'COMPLETED',
      parseResultId: result.id,
      data: {
        personalInfo: parsedData.personalInfo,
        title: parsedData.title,
        summary: parsedData.professionalSummary,
        education: parsedData.education,
        workExperience: parsedData.workExperience,
        skills,
        profile: {
          expectedSalary: parsedData.expectedSalary,
          workPreference: parsedData.workPreference,
          yearsOfExperience: parsedData.yearsOfExperience,
          noticePeriod: parsedData.noticePeriod,
          availabilityStatus: parsedData.availabilityStatus,
        },
      },
    };
  }

  async confirmAndSave(jobSeekerId: string, dto: ConfirmParsedDataDto) {
    const parseResult = await this.cvParseResultRepository.findByJobSeekerId(jobSeekerId);

    if (!parseResult || parseResult.status !== 'COMPLETED') {
      throw new BadRequestException('No completed parse result to confirm');
    }

    await this.databaseService.$transaction(async (tx) => {
      // 1. Update job seeker basic info
      await tx.jobSeeker.update({
        where: { id: jobSeekerId },
        data: {
          firstName: dto.personalInfo.firstName,
          lastName: dto.personalInfo.lastName,
        },
      });

      // 2. Upsert profile
      await tx.jobSeekerProfile.upsert({
        where: { jobSeekerId },
        update: {
          title: dto.title,
          summary: dto.summary,
          phone: dto.personalInfo.phone,
          cvEmail: dto.personalInfo.email,
          location: dto.personalInfo.location || null,
          linkedinUrl: dto.personalInfo.linkedinUrl || null,
          githubUrl: dto.personalInfo.githubUrl || null,
          portfolioUrl: dto.personalInfo.portfolioUrl || null,
          workPreference: dto.profile.workPreference,
          yearsOfExperience: dto.profile.yearsOfExperience,
          availabilityStatus: dto.profile.availabilityStatus,
          expectedSalary: dto.profile.expectedSalary || null,
          noticePeriod: dto.profile.noticePeriod || null,
        },
        create: {
          jobSeekerId,
          title: dto.title,
          summary: dto.summary,
          phone: dto.personalInfo.phone,
          cvEmail: dto.personalInfo.email,
          location: dto.personalInfo.location || null,
          linkedinUrl: dto.personalInfo.linkedinUrl || null,
          githubUrl: dto.personalInfo.githubUrl || null,
          portfolioUrl: dto.personalInfo.portfolioUrl || null,
          workPreference: dto.profile.workPreference,
          yearsOfExperience: dto.profile.yearsOfExperience,
          expectedSalary: dto.profile.expectedSalary || null,
          noticePeriod: dto.profile.noticePeriod || null,
          availabilityStatus: dto.profile.availabilityStatus,
        },
      });

      // 3. Delete existing education/work/skills
      await tx.education.deleteMany({ where: { jobSeekerId } });
      await tx.workExperience.deleteMany({ where: { jobSeekerId } });
      await tx.jobSeekerSkill.deleteMany({ where: { jobSeekerId } });

      // 4. Insert new education
      if (dto.education.length > 0) {
        await tx.education.createMany({
          data: dto.education.map((e) => ({
            jobSeekerId,
            institutionName: e.institutionName,
            degreeType: e.degreeType,
            fieldOfStudy: e.fieldOfStudy,
            startDate: new Date(e.startDate),
            endDate: e.endDate ? new Date(e.endDate) : null,
            isCurrent: e.isCurrent,
            gpa: e.gpa || null,
            description: e.description || null,
          })),
        });
      }

      // 5. Insert new work experience
      if (dto.workExperience.length > 0) {
        await tx.workExperience.createMany({
          data: dto.workExperience.map((w) => ({
            jobSeekerId,
            companyName: w.companyName,
            jobTitle: w.jobTitle,
            location: w.location || null,
            startDate: new Date(w.startDate),
            endDate: w.endDate ? new Date(w.endDate) : null,
            isCurrent: w.isCurrent,
            description: w.description,
          })),
        });
      }

      // 6. Insert skills (match to existing skills in DB)
      for (const skill of dto.skills) {
        const existingSkill = await tx.skill.findFirst({
          where: { name: { equals: skill.name, mode: 'insensitive' } },
        });

        if (existingSkill) {
          await tx.jobSeekerSkill.create({
            data: {
              jobSeekerId,
              skillId: existingSkill.id,
              verified: skill.verified || false,
            },
          });
        }
      }

      // 7. Mark parse result as confirmed
      await tx.cvParseResult.update({
        where: { jobSeekerId },
        data: {
          status: 'CONFIRMED',
          parsedAt: new Date(),
        },
      });
    });

    return { message: 'Profile updated successfully from CV' };
  }
}
