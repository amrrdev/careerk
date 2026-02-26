import { z } from 'zod';

export const SkillGapAnalysisSchema = z.object({
  cvScore: z.number().min(0).max(100).describe('Overall match score as percentage (0-100)'),

  strengths: z.array(z.string()).describe('List of strong skills the candidate already possesses'),

  gaps: z
    .array(
      z.object({
        skill: z.string().describe('Missing or weak skill'),
        importance: z
          .enum(['high', 'medium', 'low'])
          .describe('How critical this skill is for the role'),
        suggestion: z.string().describe('Actionable advice on how to acquire this skill'),
      }),
    )
    .describe('Skills the candidate needs to improve or learn'),

  recommendations: z.array(z.string()).describe('General career development recommendations'),
});

export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisSchema>;
