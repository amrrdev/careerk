import { Module } from '@nestjs/common';
import { DirectJobService } from './direct-job.service';
import { DirectJobRepository } from './repository/direct-job.repository';
import { DirectJobRepositoryImpl } from './repository/direct-job.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { DirectJobController } from './direct-job.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [DirectJobController],
  providers: [
    DirectJobService,
    {
      provide: DirectJobRepository,
      useClass: DirectJobRepositoryImpl,
    },
  ],
})
export class DirectJobModule {}
