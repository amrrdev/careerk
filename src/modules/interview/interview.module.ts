import { Module } from '@nestjs/common';
import { InterviewController } from './interview.controller';
import { InterviewService } from './interview.service';
import { InterviewRepository } from './repository/interview.repository';
import { InterviewRepositoryImpl } from './repository/interview.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InterviewController],
  providers: [
    InterviewService,
    {
      provide: InterviewRepository,
      useClass: InterviewRepositoryImpl,
    },
  ],
})
export class InterviewModule {}
