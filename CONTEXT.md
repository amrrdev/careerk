# CareerK Backend Context

Last updated: 2026-02-27
Repository root: `A:\graudation-project\careerk`

## 1. What this project is

CareerK is a NestJS backend for a job platform with:
- authentication (job seeker + company),
- profile and resume (CV) ingestion/parsing,
- job posting/search,
- applications,
- bookmarks,
- async email jobs,
- async skill-gap analysis using an LLM.

Primary source of truth is code under `src/` and schema in `prisma/schema.prisma`.

## 2. Stack and runtime

- Framework: NestJS 11
- Language: TypeScript
- Package manager: pnpm
- ORM: Prisma 7 (client generated to `generated/prisma`)
- DB: PostgreSQL
- Cache/ephemeral state: Redis (OTP + refresh token storage)
- Queue: BullMQ (Redis-backed)
- Email: Nodemailer (SMTP/Gmail)
- Object storage: S3-compatible API (configured for Cloudflare R2)
- NLP service: external HTTP service at `http://localhost:8000/parse-cv`
- LLM: `@ai-sdk/groq` with model `openai/gpt-oss-20b`

## 3. Application bootstrap and global behavior

- Entrypoint: `src/main.ts`
- Global pipe: `ValidationPipe` with `whitelist: true`, `transform: true`
- Global interceptor: `ResponseInterceptor`
- Global exception filter: `HttpExceptionFilter`
- Cookie parser enabled globally.
- No global API prefix is configured in code.

Important response behavior:
- Success responses are wrapped in `{ success, data, message, meta }` unless handler already returns an object containing both `success` and `data`.
- Error responses are normalized into `{ success: false, error: ... }`.

## 4. High-level module graph

- `AppModule`
  - Infra: `InfrastructureModule`, `RedisModule`, `EmailModule`, `QueueModule`, `CvStorageModule`
  - Domain: `IamModule`, `JobSeekerModule`, `CompanyModule`, `JobModule`, `CvModule`

Domain decomposition:
- `iam`: auth, OTP, JWT, refresh tokens, email queue jobs
- `job-seeker`: profile, education, work experience, skills, applications, skill-gap analysis
- `company`: company profile, direct jobs, company-side application views/status updates
- `jobs`: public/direct/scraped job retrieval + bookmarks
- `cv`: upload URL, confirm upload, NLP parse integration, parse-preview confirmation pipeline

## 5. Auth and authorization model

- Global auth guard: `AuthenticationGuard` registered as `APP_GUARD`
- Global roles guard: `RolesGuard` registered as `APP_GUARD`
- Default auth type is bearer unless overridden with `@Auth(AuthType.None)`
- Access token guard validates JWT and requires `tokenType === ACCESS`
- Roles are enforced via `@Roles(UserType.JOB_SEEKER | UserType.COMPANY)`
- Refresh token flow uses HTTP-only cookie key: `refreshToken`

Refresh token strategy:
- Refresh token includes `refreshTokenId`.
- Redis stores one active token id per user (`refresh-token:{userId}`).
- On refresh, old id is invalidated and new pair is issued (rotation).

OTP strategy:
- Redis key format: `otp:{purpose}:{email}`
- 6 digits, 10-minute TTL, max 3 failed attempts.
- Used for email verification and password reset.

## 6. Data model (Prisma summary)

Core entities:
- Users: `JobSeeker`, `Company`
- JobSeeker profile subgraph: `JobSeekerProfile`, `Education`, `WorkExperience`, `JobSeekerSkill`, `Skill`
- Jobs: `DirectJob`, `DirectJobSkill`, `ScrapedJob`, `ScrapedJobSkill`
- CV: `CV`, `CvParseResult`
- Engagement: `Application`, `JobBookmark`
- AI analytics: `SkillGapAnalysis`

Notable constraints:
- Unique emails for both `JobSeeker` and `Company` (cross-table uniqueness is app-enforced, not DB-enforced).
- One `JobSeekerProfile` per job seeker.
- One CV per job seeker.
- One parse result per job seeker.
- Composite uniqueness:
  - `JobSeekerSkill(jobSeekerId, skillId)`
  - `DirectJobSkill(jobId, skillId)`
  - `ScrapedJobSkill(jobId, skillId)`
  - `Application(jobSeekerId, directJobId)`
  - `JobBookmark(jobSeekerId, jobId, jobSource)`

Enums in active use:
- `UserType`, `TokenType`, OTP purposes
- `JobTypeEnum`, `WorkPreferenceEnum`, `AvailabilityStatusEnum`
- `CompanySize`, `CompanyType`
- `DirectJobStatusEnum`, `ExperienceLevelEnum`
- `ApplicationStatusEnum`
- `CvParseStatusEnum`
- `AnalysisStatusEnum`

## 7. Route inventory (actual implemented routes)

Auth:
- `POST /auth/register/job-seeker`
- `POST /auth/register/company`
- `POST /auth/verify-email`
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/resend-verification`

Job seekers:
- `GET /job-seekers`
- `GET /job-seekers/me`
- `PATCH /job-seekers/me`
- `DELETE /job-seekers/me`
- `GET /job-seekers/:id`

Job seeker work experience:
- `GET /job-seekers/me/work-experiences`
- `GET /job-seekers/me/work-experiences/:expId`
- `POST /job-seekers/me/work-experiences`
- `PATCH /job-seekers/me/work-experiences/:expId`
- `DELETE /job-seekers/me/work-experiences/:expId`

Job seeker education:
- `GET /job-seekers/me/educations`
- `GET /job-seekers/me/educations/:educationId`
- `POST /job-seekers/me/educations`
- `PATCH /job-seekers/me/educations/:educationId`
- `DELETE /job-seekers/me/educations/:educationId`

Job seeker skills:
- `GET /job-seekers/me/skills`
- `POST /job-seekers/me/skills`
- `DELETE /job-seekers/me/skills/:skillId`

Job seeker applications:
- `GET /job-seekers/me/applications`
- `POST /job-seekers/me/applications`
- `GET /job-seekers/me/applications/:id`
- `DELETE /job-seekers/me/applications/:id`

Job seeker skill analysis:
- `POST /job-seekers/me/skill-analysis`
- `GET /job-seekers/me/skill-analysis/latest`
- `GET /job-seekers/me/skill-analysis/history`
- `GET /job-seekers/me/skill-analysis/:id`

Company profile:
- `GET /companies`
- `GET /companies/me`
- `PATCH /companies/me`
- `DELETE /companies/me`
- `GET /companies/:id`

Company direct jobs:
- `GET /companies/me/jobs`
- `POST /companies/me/jobs`
- `GET /companies/me/jobs/:jobId`
- `PATCH /companies/me/jobs/:jobId`
- `DELETE /companies/me/jobs/:jobId`
- `POST /companies/me/jobs/:jobId/publish`
- `POST /companies/me/jobs/:jobId/pause`
- `POST /companies/me/jobs/:jobId/close`

Company application management:
- `GET /companies/me/applications`
- `GET /companies/me/applications/:id`
- `PATCH /companies/me/applications/:id`

Jobs/public + bookmarks:
- `GET /jobs`
- `GET /jobs/direct/:jobId`
- `GET /jobs/scraped/:jobId`
- `POST /jobs/bookmark`
- `GET /jobs/bookmark`
- `DELETE /jobs/bookmarks/:id`

CV:
- `POST /cv/presigned-url`
- `POST /cv/confirm`
- `GET /cv/me`
- `GET /cv/me/downoad-url` (typo in route path)
- `DELETE /cv/me`

CV parse:
- `GET /cv-parse/preview`
- `POST /cv-parse/confirm`

## 8. Key business flows

Registration and verification:
- Register creates user as unverified.
- OTP generated and email queued.
- Verify endpoint validates OTP, marks user verified, issues access + refresh.

Login and token refresh:
- Login checks both job seeker and company tables.
- Refresh token is cookie-based and rotated with Redis validation.

Forgot/reset password:
- Forgot endpoint is intentionally non-committal in response.
- OTP for reset is queued by email.
- Reset updates hashed password and invalidates refresh token state.

CV upload and parsing:
- Client gets presigned URL/key.
- Client uploads file directly to storage.
- Confirm endpoint verifies object existence, upserts CV row, creates parse-result row as `PENDING`.
- Service calls NLP endpoint synchronously.
- Parse result stored as `COMPLETED` or `FAILED`.
- Separate confirm endpoint writes parsed data into profile/education/work/skills and marks parse result `CONFIRMED`.

Skill gap analysis:
- Weekly limit: max 10 analyses per job seeker.
- Analysis request creates DB row with `PROCESSING`.
- BullMQ processor invokes LLM service and updates row to `COMPLETED` or `FAILED`.

## 9. External service contracts

Redis:
- refresh token storage
- OTP storage
- BullMQ transport

Email queue:
- Queue name: `iam-verification-email`
- Jobs:
  - `send-verification`
  - `send-password-reset`

Skill analysis queue:
- Queue name: `skill-gap-analysis`
- Job name: `generate-analysis`

NLP:
- `POST http://localhost:8000/parse-cv`
- Body: `{ url, jobSeekerId }`
- Expected response includes parsed sections (personal info, education, experience, skills, profile hints).

Storage:
- S3-compatible client configured via R2 env vars (`R2_ENDPOINT`, keys, bucket).

## 10. Environment variable contract (used in code)

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_TOKEN_AUDIENCE`
- `JWT_TOKEN_ISSUER`
- `JWT_ACCESS_TOKEN_TTL`
- `JWT_REFRESH_TOKEN_TTL`
- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`
- `QUEUE_HOST`
- `QUEUE_PORT`
- `QUEUE_PASSWORD`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `GMAIL_USER`
- `GMAIL_PASSWORD`
- `R2_ENDPOINT`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

## 11. Build and test status checked

- `pnpm run build`: passes.
- `pnpm run test:e2e`: fails in this environment with process spawn `EPERM`.
- `pnpm exec jest --config ./test/jest-e2e.json --runInBand`: fails due module resolution for `generated/prisma/client`.

Testing reality:
- No `src/**/*.spec.ts` unit tests.
- Single template e2e test still expects `GET /` to return `"Hello World!"`, which does not reflect current app behavior.

## 12. Known gaps, risks, and code/doc drift

Security:
- `.env` currently contains live-looking secrets and credentials. This is a critical operational risk.

Auth/authorization:
- Some job-seeker subcontrollers rely on global bearer auth but do not explicitly enforce `@Roles(UserType.JOB_SEEKER)` (`education`, `work-experience`, `skills`). This may allow authenticated company users into handlers with non-matching domain assumptions.

Route consistency:
- Typo route: `GET /cv/me/downoad-url` likely intended `download-url`.
- Bookmark routes mix singular/plural path segments (`/jobs/bookmark` vs `/jobs/bookmarks/:id`).

Config correctness:
- `SMTP_SECURE` parsing uses `Boolean(process.env.SMTP_SECURE || 'false')`, which evaluates `"false"` as `true`. This can silently misconfigure SMTP behavior.

Debug/logging noise:
- `console.log(jobSeekerId)` remains in work experience controller.
- Database service uses `console.log`/`console.error` instead of Nest logger.

Data handling:
- CV parse confirmation only links skills that already exist in `skills` table; unknown parsed skills are ignored instead of upserted.

Docs drift:
- `docs.json` and docs content indicate base URL `/api/v1`, but app code does not set global prefix.
- `api-desing.md` includes many endpoints/features not present in code.
- `Architecture.md` describes folders/modules that do not exactly match current repository structure.

Migration history:
- There are repeated `_v01` migrations with corrective follow-ups (e.g., cv parse enum rename, application enum extension, skill-gap refinement). Current schema appears coherent, but migration trail is noisy.

## 13. Practical orientation for future work

If answering future questions, trust this order:
1. `src/modules/**` and `src/infrastructure/**` implementation
2. `prisma/schema.prisma`
3. migration SQL for historical intent
4. docs (`docs/`, `api-desing.md`, `README.md`) only for non-authoritative context

Fast entry points:
- Request lifecycle: `src/main.ts`, `src/app.module.ts`, `src/core/*`
- Auth: `src/modules/iam/**`
- Data model: `prisma/schema.prisma`
- Public API: controller files under `src/modules/**`

