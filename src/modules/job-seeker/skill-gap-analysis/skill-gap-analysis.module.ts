import { forwardRef, Module } from '@nestjs/common';
import { SkillGapAnalysisLLMService } from './services/llm.service';
import { SkillGapAnalysisService } from './skill-gap-analysis.service';
import { SkillGapAnalysisRepository } from './repository/analysis.repository';
import { SkillGapAnalysisRepositoryImpl } from './repository/analysis.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { SKILL_GAP_ANALYSIS_QUEUE } from './jobs/queue.constants';
import { JobSeekerModule } from '../job-seeker.module';
import { SkillGapAnalysisProcessor } from './processors/analysis.processor';
import { SkillGapAnalysisController } from './skill-gap-analysis.controller';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({
      name: SKILL_GAP_ANALYSIS_QUEUE,
    }),
    // JobSeekerModule,
    forwardRef(() => JobSeekerModule),
  ],
  controllers: [SkillGapAnalysisController],
  providers: [
    SkillGapAnalysisLLMService,
    SkillGapAnalysisService,
    SkillGapAnalysisProcessor,
    {
      provide: SkillGapAnalysisRepository,
      useClass: SkillGapAnalysisRepositoryImpl,
    },
  ],
  exports: [SkillGapAnalysisService],
})
export class SkillGapAnalysisModule {}
