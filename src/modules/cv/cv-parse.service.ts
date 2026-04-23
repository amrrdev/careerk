import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DegreeTypeEnum } from 'generated/prisma/enums';
import { CvParseResultRepository } from './cv-parse-result/repository/cv-parse-result.repository';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import { ConfirmParsedDataRequestDto } from './dto/confirm-parsed-data.dto';
import { NlpParseCvResponse } from './cv-parse-result/types/cv-parse-result.types';

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

    const nlpData = result.parsedData as NlpParseCvResponse['data'];
    return {
      status: 'COMPLETED',
      parseResultId: result.id,
      data: {
        firstName: nlpData.personalInfo?.firstName,
        lastName: nlpData.personalInfo?.lastName,
        cvEmail: nlpData.personalInfo?.email,
        phone: nlpData.personalInfo?.phone,
        location: nlpData.personalInfo?.location,
        linkedinUrl: nlpData.personalInfo?.linkedinUrl,
        githubUrl: nlpData.personalInfo?.githubUrl,
        portfolioUrl: nlpData.personalInfo?.portfolioUrl,
        title: nlpData.title,
        summary: nlpData.professionalSummary || nlpData.title,
        education: nlpData.education || [],
        workExperience: nlpData.workExperience || [],
        skills: nlpData.skills || [],
        expectedSalary: nlpData.expectedSalary,
        workPreference: nlpData.workPreference,
        yearsOfExperience: nlpData.yearsOfExperience,
        noticePeriod: nlpData.noticePeriod,
        availabilityStatus: nlpData.availabilityStatus,
      },
    };
  }

  async confirmAndSave(jobSeekerId: string, dto: ConfirmParsedDataRequestDto) {
    const parseResult = await this.cvParseResultRepository.findById(dto.parseResultId);

    if (!parseResult || parseResult.jobSeekerId !== jobSeekerId) {
      throw new NotFoundException('Parse result not found');
    }

    if (parseResult.status !== 'COMPLETED') {
      throw new BadRequestException('No completed parse result to confirm');
    }

    const nlpData = parseResult.parsedData as NlpParseCvResponse['data'];
    const corrections = dto.data;

    const firstName = corrections.firstName ?? nlpData.personalInfo?.firstName;
    const lastName = corrections.lastName ?? nlpData.personalInfo?.lastName;
    const cvEmail = corrections.cvEmail ?? nlpData.personalInfo?.email;
    const phone = corrections.phone ?? nlpData.personalInfo?.phone;
    const title = corrections.title ?? nlpData.title;
    const summary = corrections.summary ?? nlpData.professionalSummary ?? nlpData.title;

    const workPreference = corrections.workPreference;
    const availabilityStatus = corrections.availabilityStatus;

    await this.databaseService.$transaction(async (tx) => {
      await tx.jobSeeker.update({
        where: { id: jobSeekerId },
        data: { firstName, lastName },
      });

      await tx.jobSeekerProfile.upsert({
        where: { jobSeekerId },
        update: {
          title,
          summary,
          phone,
          cvEmail,
          location: corrections.location ?? nlpData.personalInfo?.location ?? null,
          linkedinUrl: corrections.linkedinUrl ?? nlpData.personalInfo?.linkedinUrl ?? null,
          githubUrl: corrections.githubUrl ?? nlpData.personalInfo?.githubUrl ?? null,
          portfolioUrl: corrections.portfolioUrl ?? nlpData.personalInfo?.portfolioUrl ?? null,
          workPreference,
          yearsOfExperience: nlpData.yearsOfExperience ?? 0,
          availabilityStatus,
          expectedSalary: corrections.expectedSalary ?? nlpData.expectedSalary ?? null,
          noticePeriod:
            corrections.noticePeriod ??
            (nlpData.noticePeriod ? Number(nlpData.noticePeriod) : null),
        },
        create: {
          jobSeekerId,
          title,
          summary,
          phone,
          cvEmail,
          location: corrections.location ?? nlpData.personalInfo?.location ?? null,
          linkedinUrl: corrections.linkedinUrl ?? nlpData.personalInfo?.linkedinUrl ?? null,
          githubUrl: corrections.githubUrl ?? nlpData.personalInfo?.githubUrl ?? null,
          portfolioUrl: corrections.portfolioUrl ?? nlpData.personalInfo?.portfolioUrl ?? null,
          workPreference,
          yearsOfExperience: nlpData.yearsOfExperience ?? 0,
          availabilityStatus,
          expectedSalary: corrections.expectedSalary ?? nlpData.expectedSalary ?? null,
          noticePeriod:
            corrections.noticePeriod ??
            (nlpData.noticePeriod ? Number(nlpData.noticePeriod) : null),
        },
      });

      await tx.education.deleteMany({ where: { jobSeekerId } });
      await tx.workExperience.deleteMany({ where: { jobSeekerId } });
      await tx.jobSeekerSkill.deleteMany({ where: { jobSeekerId } });

      const education = corrections.education ?? nlpData.education ?? [];
      if (education.length > 0) {
        await tx.education.createMany({
          data: education.map((e) => ({
            jobSeekerId,
            institutionName: e.institutionName,
            degreeType: e.degreeType as DegreeTypeEnum,
            fieldOfStudy: e.fieldOfStudy,
            startDate: new Date(e.startDate),
            endDate: e.endDate ? new Date(e.endDate) : null,
            isCurrent: e.isCurrent,
            gpa: e.gpa ?? null,
            description: e.description ?? null,
          })),
        });
      }

      const workExperience = corrections.workExperience ?? nlpData.workExperience ?? [];
      if (workExperience.length > 0) {
        await tx.workExperience.createMany({
          data: workExperience.map((w) => ({
            jobSeekerId,
            companyName: w.companyName,
            jobTitle: w.jobTitle,
            location: w.location ?? null,
            startDate: new Date(w.startDate),
            endDate: w.endDate ? new Date(w.endDate) : null,
            isCurrent: w.isCurrent,
            description: w.description,
          })),
        });
      }

      const nlpSkillNames = nlpData.skills?.map((s) => s.name) ?? [];
      const userSkillNames = corrections.skills ?? [];

      const allSkills = [
        ...nlpSkillNames.map((name) => ({ name, verified: true })),
        ...userSkillNames
          .filter((name) => !nlpSkillNames.map((n) => n.toLowerCase()).includes(name.toLowerCase()))
          .map((name) => ({ name, verified: false })),
      ];

      const processedSkillIds = new Set<string>();

      for (const { name: skillName, verified } of allSkills) {
        let skill = await tx.skill.findFirst({
          where: { name: { equals: skillName, mode: 'insensitive' } },
          select: { id: true },
        });

        if (!skill) {
          skill = await tx.skill.create({
            data: { name: skillName },
            select: { id: true },
          });
        }

        if (!processedSkillIds.has(skill.id)) {
          processedSkillIds.add(skill.id);
          await tx.jobSeekerSkill.create({
            data: {
              jobSeekerId,
              skillId: skill.id,
              verified,
            },
          });
        }
      }

      await tx.cvParseResult.update({
        where: { id: parseResult.id },
        data: { status: 'CONFIRMED', parsedAt: new Date() },
      });
    });

    return { message: 'Profile updated successfully from CV' };
  }
}
