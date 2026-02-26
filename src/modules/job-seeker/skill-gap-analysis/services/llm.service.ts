import { Injectable } from '@nestjs/common';
import { generateObject } from 'ai';
import { GenerateAnalysisInput } from '../types/analysis.types';
import { groq } from '@ai-sdk/groq';
import { SkillGapAnalysisOutput, SkillGapAnalysisSchema } from '../schema/analysis.schema';

@Injectable()
export class SkillGapAnalysisLLMService {
  async generateAnalysis(input: GenerateAnalysisInput): Promise<SkillGapAnalysisOutput> {
    const { targetRole, currentSkills, yearsOfExperience, workExperience } = input;

    const { object } = await generateObject({
      model: groq('openai/gpt-oss-20b'),
      schema: SkillGapAnalysisSchema,
      prompt: `
      You are a senior technical recruiter and career advisor with deep expertise in software engineering hiring in 2026.
      Analyze this candidate's profile for the role: "${targetRole}"
      === CANDIDATE PROFILE ===
      Years of Experience: ${yearsOfExperience}
      Skills: ${currentSkills.join(', ')}
      Work History: ${workExperience.join(', ')}
      === INSTRUCTIONS ===
      **cvScore (0-100) SCORING REQUIRED - FAIR:**
      First, identify the 4 most important evaluation dimensions for a ${targetRole} role in 2026,
      and assign each a weight that sums to 100%. Then score the candidate against each dimension.
      **Scoring Guidelines (MUST FOLLOW):**
      - 85-100: Strong match - candidate has most key skills for the role
      - 70-84: Good match - candidate has core skills with minor gaps
      - 55-69: Moderate match - candidate has foundation but needs development
      - Below 55: ONLY if candidate lacks fundamental requirements
      **Give credit for positives:**
      - Demonstrated achievements (%, metrics improvements)
      - Transferable skills from adjacent technologies
      - Learning agility (if they've picked up multiple technologies)
      - Relevant domain knowledge
      **Cap negative impact:**
      - No single gap should reduce the score by more than 5 points
      - A candidate with strong fundamentals and learning ability should score at least 70+
      Example dimensions for reference (use these only if relevant, otherwise define your own):
      - For backend roles: core languages/frameworks, system design, DevOps maturity, database expertise
      - For frontend roles: UI frameworks, performance optimization, accessibility, design system experience
      - For DevOps/SRE roles: infrastructure as code, observability, incident management, cloud platforms
      - For data roles: data modeling, ML frameworks, pipeline tooling, statistics fundamentals
      - For mobile roles: platform SDKs, offline-first design, app store deployment, performance profiling
      Define the dimensions appropriate for ${targetRole}, weight them, score each, then compute the final weighted score.

      **strengths:**
      List 4-6 specific strengths that are particularly valuable for ${targetRole} in 2026.
      Explain briefly WHY each is valuable — don't just list skill names.

      **gaps:**
      CRITICAL RULES:
      1. Before listing ANY gap, verify it is NOT already present in the candidate's skill list
      2. Only include skills genuinely missing AND important for ${targetRole} at their experience level
      3. Do not suggest foundational skills they've clearly already applied in their work history
      Importance levels:
      - high: A blocking factor — most ${targetRole} job postings require this
      - medium: A differentiator that noticeably improves prospects
      - low: Nice-to-have for longer-term career progression
      **recommendations:**
      3-5 recommendations that are:
      - Specific to THIS candidate's actual profile, not generic advice
      - Ordered by priority / impact
      - Actionable within 3-6 months
      - Never recommending something they already have or have done
      === OUTPUT FORMAT EXAMPLE ===
      You MUST return valid JSON that matches this exact structure:
      {
        "cvScore": 75,
        "strengths": [
          "Strong testing focus: Achieving 80% coverage demonstrates commitment to quality, critical for production systems.",
          "Full-stack proficiency: Experience with MEAN stack and multiple databases provides flexibility across the stack."
        ],
        "gaps": [
          {
            "skill": "System Design",
            "importance": "high",
            "suggestion": "Practice designing scalable systems using resources like 'System Design Interview' book and Exercism"
          },
          {
            "skill": "CI/CD Pipeline",
            "importance": "medium",
            "suggestion": "Set up GitHub Actions or GitLab CI pipelines for personal projects"
          }
        ],
        "recommendations": [
          "Build a side project demonstrating microservices architecture to strengthen system design skills",
          "Contribute to open-source projects to gain visibility and improve collaboration skills",
          "Obtain AWS or GCP certification to formalize cloud expertise"
        ]
      }
      Ensure you include ALL four fields: cvScore, strengths, gaps, recommendations
      `.trim(),
    });

    return object;
  }
}
