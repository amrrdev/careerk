import { Module } from '@nestjs/common';
import { DirectJobService } from './direct-job.service';
import { DirectJobRepository } from './repository/direct-job.repository';
import { DirectJobRepositoryImpl } from './repository/direct-job.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DirectJobController } from './direct-job.controller';
import { NlpModule } from 'src/infrastructure/nlp/nlp.module';
import { BullModule } from '@nestjs/bullmq';
import { NLP_QUEUE } from './processor/nlp-service.jobs';
import { NlpProcessor } from './processor/nlp-service.processor';

@Module({
  imports: [
    DatabaseModule,
    NlpModule,
    BullModule.registerQueue({
      name: NLP_QUEUE,
    }),
  ],
  controllers: [DirectJobController],
  providers: [
    DirectJobService,
    NlpProcessor,
    {
      provide: DirectJobRepository,
      useClass: DirectJobRepositoryImpl,
    },
  ],
})
export class DirectJobModule {}
