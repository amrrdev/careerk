import { Injectable } from '@nestjs/common';
import { InterviewRepository } from './repository/interview.repository';
import { InterviewQueryDto } from './dto/interview-query.dto';

@Injectable()
export class InterviewService {
  constructor(private readonly interviewRepository: InterviewRepository) {}

  async getQuestions(filters: InterviewQueryDto) {
    return this.interviewRepository.findAll(filters);
  }
}
