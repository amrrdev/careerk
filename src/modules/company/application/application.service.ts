import { Injectable, NotFoundException } from '@nestjs/common';
import { CompanyApplicationRepository } from './repository/application.repository';
import { ApplicationQueryDto } from './dto/application-query.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { CvService } from 'src/modules/cv/cv.service';
import { NotificationPreferenceService } from 'src/modules/job-seeker/notification-preference/notification-preference.service';
import { InjectQueue } from '@nestjs/bullmq';
import {
  APPLICATION_STATUS_EMAIL_QUEUE,
  SEND_APPLICATION_STATUS_EMAIL,
} from './jobs/queue.constants';
import { Queue } from 'bullmq';
import { UpdateApplicationStatus } from './jobs/send-update-application-status-email.job';

@Injectable()
export class CompanyApplicationService {
  constructor(
    private readonly applicationRepository: CompanyApplicationRepository,
    private readonly jobSeekerNotificationPreference: NotificationPreferenceService,
    private readonly cvService: CvService,
    @InjectQueue(APPLICATION_STATUS_EMAIL_QUEUE) private readonly appStatusEmailQueue: Queue,
  ) {}

  async getCompanyApplications(companyId: string, filters: ApplicationQueryDto) {
    const result = await this.applicationRepository.findApplicationsByCompanyId(companyId, filters);

    const pairs = result.applications.map((app) => ({
      jobSeekerId: app.jobSeeker.id,
      directJobId: app.directJob.id,
    }));

    const matchScores = await this.applicationRepository.findDirectJobMatches(pairs);

    return {
      ...result,
      applications: result.applications.map((app) => ({
        ...app,
        matchScore: matchScores.get(`${app.jobSeeker.id}:${app.directJob.id}`) ?? 0,
      })),
    };
  }

  async getApplicationById(applicationId: string, companyId: string) {
    const application = await this.applicationRepository.findApplicationById(
      applicationId,
      companyId,
    );
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const [directJobMatch, cvUrl] = await Promise.all([
      this.applicationRepository.findDirectJobMatch(
        application.jobSeeker.id,
        application.directJob.id,
      ),
      this.cvService.getMyCvDownloadUrl(application.jobSeeker.id),
    ]);
    const { jobSeekerSkills, ...jobSeekerRest } = application.jobSeeker;

    return {
      ...application,
      matchScore: Number(directJobMatch?.matchScore ?? 0),
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
    const application = await this.applicationRepository.findApplicationForStatusUpdate(
      applicationId,
      companyId,
    );
    if (!application) {
      throw new NotFoundException('no application exists with this id');
    }

    await this.applicationRepository.updateApplication(applicationId, companyId, data);

    const notificationPreference =
      await this.jobSeekerNotificationPreference.getMyNotificationPreference(
        application.jobSeekerId,
      );

    if (!notificationPreference.applicationStatusNotificationsEnabled) {
      return;
    }

    await this.appStatusEmailQueue.add(
      SEND_APPLICATION_STATUS_EMAIL,
      {
        firstName: application.jobSeeker.firstName,
        jobSeekerEmail: application.jobSeeker.email,
        status: data.status,
      } satisfies UpdateApplicationStatus,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      },
    );
  }
}
