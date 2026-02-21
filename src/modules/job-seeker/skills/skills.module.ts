import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { SkillsRepository } from './repository/skills.repository';
import { SkillsRepositoryImpl } from './repository/skills.repository.impl';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SkillsController],
  providers: [
    SkillsService,
    {
      provide: SkillsRepository,
      useClass: SkillsRepositoryImpl,
    },
  ],
})
export class SkillsModule {}
