import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyApplicationRepository } from './repository/application.repository';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CvService } from 'src/modules/cv/cv.service';

@Injectable()
export class CompanyApplicationService {
  constructor(
    private readonly applicationRepository: CompanyApplicationRepository,
    private readonly cvService: CvService,
  ) {}

  async getCompanyApplications(companyId: string, filters: ApplicationQueryDto) {
    return this.applicationRepository.findApplicationsByCompanyId(companyId, filters);
  }

  async getApplicationById(applicationId: string, companyId: string) {
    const application = await this.applicationRepository.findApplicationById(
      applicationId,
      companyId,
    );
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const cvUrl = await this.cvService.getMyCvDownloadUrl(application.jobSeeker.id);
    const { jobSeekerSkills, ...jobSeekerRest } = application.jobSeeker;

    return {
      ...application,
      jobSeeker: {
        ...jobSeekerRest,
        skills: jobSeekerSkills.map((jss) => ({
          id: jss.skill.id,
          name: jss.skill.name,
          verified: jss.verified,
        })),
        cv: cvUrl.downloadUrl,
      },
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    companyId: string,
    data: UpdateApplicationDto,
  ) {
    const application = await this.applicationRepository.checkExistingApplication(
      applicationId,
      companyId,
    );
    if (!application) {
      throw new NotFoundException('no application exists with this id');
    }

    await this.applicationRepository.updateApplication(applicationId, companyId, data);
  }
}
