import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { MatchingRepository } from './repository/matching.repository';
import { MatchingRepositoryImpl } from './repository/matching.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module'; // use the same DatabaseModule as JobSeekerModule

@Module({
  imports: [DatabaseModule], // use DatabaseModule for DB access
  controllers: [MatchingController],
  providers: [
    MatchingService,
    {
      provide: MatchingRepository,
      useClass: MatchingRepositoryImpl,
    },
  ],
  exports: [MatchingRepository],
})
export class MatchingModule {}
