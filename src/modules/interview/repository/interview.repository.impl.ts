import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/infrastructure/database/database.service';
import {
  InterviewQuestionFilters,
  PaginatedInterviewQuestions,
  interviewQuestionSelect,
} from '../types/interview.types';
import { InterviewRepository } from './interview.repository';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class InterviewRepositoryImpl implements InterviewRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(filters: InterviewQuestionFilters): Promise<PaginatedInterviewQuestions> {
    const { role, level, category, page = 1, limit = 20 } = filters;
    const where: Prisma.InterviewQuestionWhereInput = {};

    if (role) where.role = role;
    if (level) where.level = level;
    if (category) where.category = category;

    const skip = (page - 1) * limit;

    const [questions, total] = await Promise.all([
      this.databaseService.interviewQuestion.findMany({
        where,
        ...interviewQuestionSelect,
        skip,
        take: limit,
      }),
      this.databaseService.interviewQuestion.count({ where }),
    ]);

    return {
      questions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
