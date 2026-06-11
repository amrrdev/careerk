import { Injectable } from '@nestjs/common';
import { InterviewQuestionFilters, PaginatedInterviewQuestions } from '../types/interview.types';

@Injectable()
export abstract class InterviewRepository {
  abstract findAll(filters: InterviewQuestionFilters): Promise<PaginatedInterviewQuestions>;
}
