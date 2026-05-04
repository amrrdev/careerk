# CareerK Backend Architecture and Engineering Decisions

## Introduction

CareerK is the backend of a two-sided hiring platform that connects job seekers with companies through a single digital system. The backend is responsible for much more than basic CRUD operations. It manages secure authentication, user profiles, job publishing, job applications, bookmarks, CV upload and parsing, intelligent matching, notification delivery, and AI-assisted skill-gap analysis. In other words, it acts as the operational brain of the platform.

From the beginning, the goal of this backend was to build a system that is academically strong for a graduation project and technically realistic for future production use. For that reason, the design focuses on three principles: clear separation of concerns, practical scalability, and feature extensibility. Instead of building a chaotic codebase where every feature is mixed together, we organized the application into domain modules with dedicated infrastructure services. This makes the system easier to understand, easier to test, and much safer to extend.

What makes this backend especially promising is that it already supports intelligent workflows instead of stopping at traditional web forms and database tables. It integrates asynchronous job processing, external NLP services, AI-generated skill analysis, secure file handling through presigned URLs, and notification pipelines that improve the user experience without slowing down the core API. That combination gives the project both immediate practical value and long-term product potential.

## Backend Scope and Platform Responsibilities

The backend was designed to serve two major actors with different needs:

- Job seekers who register, verify their accounts, manage profiles, upload CVs, add skills, save jobs, apply to direct jobs, receive match notifications, and request skill-gap analysis.
- Companies that register, manage their organization profile, create and publish direct jobs, review applicants, update application status, and receive matching insights for their vacancies.

To support these actors, the backend implements the following business capabilities:

- Identity and access management, including registration, login, email verification, refresh-token rotation, password reset, and logout.
- Job seeker profile management, including work experience, education, skills, profile image upload, and notification preferences.
- Company profile management, including logo upload and direct job lifecycle management.
- Public job browsing across both company-created jobs and externally scraped jobs.
- Bookmarking and application workflows.
- CV upload, CV parsing, preview, persistence, and confirmation.
- Matching workflows between jobs and job seekers.
- AI-assisted skill-gap analysis for personalized career guidance.
- Queue-based email notifications for verification, password reset, application status changes, and matching completion.

This scope shows that the backend is not a narrow academic prototype. It is a cohesive digital platform backend with security, data management, asynchronous processing, and intelligence features working together.

## Architectural Style

The most important architectural decision in CareerK is the use of a modular monolith with layered boundaries. We did not begin with microservices because that would add deployment complexity, distributed debugging problems, and unnecessary overhead for a graduation-stage product. Instead, we chose a single NestJS application that contains clearly separated modules. This gives us the simplicity of one deployable system while preserving many of the maintainability benefits that teams usually want from service-oriented systems.

At a high level, the architecture looks like this:

Client applications call the NestJS API. The API routes requests into domain modules such as IAM, Job Seeker, Company, Jobs, CV, and Matching. Those modules depend on infrastructure adapters such as PostgreSQL through Prisma, Redis, BullMQ queues, S3-compatible storage, SMTP email delivery, and external NLP services. Global response formatting and exception handling are applied centrally so every endpoint follows a consistent contract.

The main architectural layers are:

| Layer | Responsibility |
| --- | --- |
| `modules/` | Business domains such as authentication, job seekers, companies, jobs, CV, and matching |
| `infrastructure/` | Database, Redis, queue, email, storage, and NLP integrations |
| `core/` | Cross-cutting concerns such as response interception and exception formatting |
| `prisma/` | Schema and migrations for persistent data |
| `docs/` | Documentation source for the API and product flows |

The domain modules are the real center of the application. For example:

- `iam` owns authentication, authorization, OTP generation, password management, JWT handling, and refresh-token workflows.
- `job-seeker` owns profile data, skills, education, experience, applications, notification preferences, and skill-gap analysis.
- `company` owns company profile management, direct job publishing, and application review flows.
- `jobs` owns public listing and retrieval of direct and scraped jobs, as well as bookmarks.
- `cv` owns CV upload, storage validation, parsing, preview, and persistence.
- `matching` owns retrieval of match results and processing of webhook callbacks from the external matching pipeline.

This organization is a major strength because the codebase reflects the business model directly. A new developer can quickly understand what each module is responsible for without tracing logic across unrelated folders.

## Technology Stack and Why We Chose It

The technology choices were made to balance productivity, maintainability, and real backend capability.

| Technology | Role in the System | Why It Was Chosen |
| --- | --- | --- |
| NestJS 11 | Backend framework | Strong modular structure, decorators, dependency injection, and good support for scalable Node.js APIs |
| TypeScript | Main language | Type safety, better refactoring, and clearer contracts between modules |
| PostgreSQL | Primary database | Reliable relational storage for complex platform data and future reporting needs |
| Prisma 7 | ORM and database access | Strong typing, readable queries, migrations, and a clean bridge between code and schema |
| Redis | Ephemeral state store | Fast storage for OTPs, refresh-token state, and queue coordination |
| BullMQ | Background job processing | Clean support for retries, backoff, and asynchronous workflows |
| Nodemailer | Email delivery | Practical SMTP integration for verification, reset, and notification emails |
| S3/R2-compatible object storage | File storage | Efficient handling of CVs and profile media outside the application server |
| External NLP service | CV parsing and matching triggers | Separates heavy intelligent processing from the core API |
| AI SDK with Groq model integration | Skill-gap analysis | Adds intelligent career analysis while keeping the response schema structured |
| class-validator and class-transformer | Input validation | Ensures request data is validated and transformed before reaching business logic |
| Jest, ESLint, Prettier, Husky | Quality workflow | Supports testing, consistent style, and safer team collaboration |

These choices are strong because they do not chase novelty for its own sake. Each tool solves a real engineering problem in the system. Together they create a backend that is modern, understandable, and extendable.

## Major Engineering Decisions

### 1. Choosing a modular monolith instead of microservices

We intentionally kept the system as one NestJS application. For a graduation project, this is the more disciplined choice. It reduces operational overhead while still allowing strong internal boundaries. Because modules are already separated by domain, the project can later evolve toward multiple deployable services if scale or organizational needs demand it.

### 2. Using the repository pattern between services and the database

Business services do not directly depend on Prisma queries in most major areas. Instead, repositories handle database access while services focus on rules and workflows. This decision improves testability, keeps domain logic cleaner, and avoids turning services into large data-access scripts. It also gives the project a clearer path if the database layer ever needs to change.

### 3. Separating business logic from infrastructure

External integrations such as Redis, email, queues, media storage, CV storage, and NLP access are placed in the infrastructure layer. That keeps domain modules focused on business responsibilities. This separation is one of the reasons the backend feels organized rather than fragile. A company workflow should not need to know how SMTP is configured, and a CV service should not contain low-level storage client setup logic.

### 4. Building security around layered authentication flows

Security is handled through JWT access tokens, refresh tokens, OTP verification, bcrypt password hashing, role-based authorization, and HTTP-only cookies for refresh-token storage on the client side. Refresh-token state is also stored in Redis, which allows token invalidation on logout or password reset. This is a stronger design than stateless-only token handling because it gives the system real session control.

### 5. Moving slow or external work to background queues

Verification emails, password reset emails, application status emails, direct-job matching triggers, and skill-gap analysis all use queue-based processing rather than blocking the main request path. This decision improves API responsiveness and user experience. It also makes the platform more reliable under load because retries and backoff can be handled in the queue layer.

An additional pragmatic decision is that processors currently run inside the same NestJS application process. This keeps deployment simple during the graduation phase while preserving the queue boundaries needed to extract dedicated workers later.

### 6. Using presigned URLs for CV and media uploads

The backend does not stream uploaded files through the API server. Instead, it generates presigned upload URLs for S3-compatible storage and confirms the upload afterward. This is an important architectural decision because it reduces server load, lowers memory pressure, improves upload scalability, and aligns with industry-grade file handling patterns.

### 7. Modeling direct jobs and scraped jobs separately

The platform stores company-created jobs and externally scraped jobs in separate tables and workflows. This was the correct decision because the two sources have different ownership, publishing logic, and matching behavior. Trying to force both into one model would make the system harder to reason about and would mix internal and external data lifecycles.

### 8. Standardizing responses and errors globally

The backend uses a global response interceptor and a global exception filter. Successful responses are wrapped in a consistent structure, and sensitive fields such as passwords are removed from outgoing payloads. Errors are also formatted consistently, including Prisma-related failures. This decision improves frontend integration, debugging clarity, and API professionalism.

### 9. Structuring AI output with schema validation

For skill-gap analysis, the backend does not accept free-form LLM output blindly. It uses schema-based structured generation so the result must match a defined shape with score, strengths, gaps, and recommendations. This is a mature engineering choice because it reduces unpredictability and makes AI output safer to store and render in product features.

## What We Implemented in Practice

The backend already includes several complete workflows that demonstrate real system thinking.

### Authentication and account lifecycle

Users can register as either job seekers or companies. During registration, passwords are hashed, accounts are created in PostgreSQL, OTP codes are generated, and verification emails are queued asynchronously. After email verification, the backend issues access and refresh tokens. Login, logout, refresh-token rotation, forgot password, reset password, and password change are all supported. This gives the platform a serious access-control foundation rather than a demo-only login form.

### CV upload and parsing workflow

Job seekers request a presigned URL, upload the CV directly to object storage, then call the confirmation endpoint. The backend verifies that the file exists, updates CV metadata, creates a parse result record, and calls the NLP service to extract structured information such as personal details, education, experience, skills, and availability. The parsed data is then stored for later preview and confirmation. This workflow is especially valuable because it transforms a raw document into reusable platform intelligence.

### Direct job publishing and matching

Companies can create jobs in draft mode, update them, and publish them when ready. When a job is published, the backend queues a matching request to the external NLP or matching service. Later, webhook callbacks notify the backend when processing is complete. The backend then triggers email notifications so companies receive results without polling manually. This is a strong example of event-driven backend design.

### Job seeker matching and notifications

The backend stores and serves both direct-job matches and scraped-job matches. It supports filtering by source, score, page, and availability criteria. When scraped-job matching results are completed, the backend can group top matches and notify job seekers based on their notification preferences. This shows that the project goes beyond storing data; it actively delivers relevant opportunities to users.

### Skill-gap analysis

The backend can assemble a job seeker's title, years of experience, current skills, and work history, then send that information to an AI model through a queue-backed workflow. The result is a structured analysis with a score, strengths, missing skills, and recommendations. This feature makes the platform more than a job board. It becomes a career development assistant.

### Applications and status management

Job seekers can apply to direct jobs, while companies can review those applications and update status. When the company changes an application state, the backend checks notification preferences and queues an email update if the user has enabled that feature. This creates a better communication loop and a more professional hiring experience.

## Why This Backend Is Strong and Promising

The strength of this backend comes from the combination of software engineering discipline and product-oriented thinking.

First, it is maintainable. The modules map cleanly to business domains, repositories isolate data access, DTOs validate inputs, and global filters standardize API behavior. That means future contributors can extend features without turning the codebase into a tangled system.

Second, it is scalable in the right places. Redis and BullMQ provide an asynchronous backbone for tasks that should not delay user requests. Presigned uploads keep file traffic away from the API server. PostgreSQL remains the source of truth for durable business data. External AI and NLP work is separated from the core request-response path. These are the exact kinds of decisions that allow a platform to grow responsibly.

Third, it is secure and user-aware. Passwords are hashed, OTPs expire, refresh tokens can be invalidated, authorization is role-based, and notification delivery respects user preferences. The system treats security and user control as design requirements, not optional afterthoughts.

Fourth, it is product-ready and intelligent. Many student projects stop at CRUD plus authentication. CareerK goes further by combining recruitment workflows with AI-assisted services, matching pipelines, and automated communication. That gives the project a more modern identity and makes it relevant to real hiring-platform expectations.

Finally, it is promising because the current architecture leaves room for growth. Dedicated worker processes, observability dashboards, stronger caching strategies, API versioning, and deployment hardening can all be added without redesigning the entire codebase. The project already has the correct structural foundation.

## Conclusion

The CareerK backend is a strong graduation-project backend because it demonstrates far more than the ability to expose REST endpoints. It shows architectural thinking, practical technology selection, security awareness, asynchronous workflow design, external service integration, and intelligent feature development. By combining a modular NestJS architecture with PostgreSQL, Redis, BullMQ, object storage, NLP integration, and structured AI analysis, the backend becomes both technically solid and strategically promising.

In short, this backend is not impressive because it is complicated. It is impressive because its complexity is organized. Every major technical decision was taken to support maintainability, performance, scalability, and user value. That is what makes CareerK a serious and promising backend system for a graduation project and a strong base for future product evolution.
