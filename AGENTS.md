# AGENTS.md - CareerK Backend Development Guide

This file provides guidelines for AI agents working in this codebase.

## Project Overview

- **Framework**: NestJS 11 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Package Manager**: pnpm
- **Test Framework**: Jest
- **Linting**: ESLint + Prettier (Prettier rules enforced as ESLint errors)

## Build/Lint/Test Commands

```bash
# Build
pnpm run build                    # Nest build → dist/

# Lint & Format
pnpm run lint                     # ESLint with --fix
pnpm run format                   # Prettier write

# Start
pnpm run start                    # nest start
pnpm run start:dev                # nest start --watch (development)
pnpm run start:debug              # nest start --debug --watch
pnpm run start:prod               # node dist/main

# Testing
pnpm run test                     # Run all unit tests
pnpm run test:watch               # Watch mode for development
pnpm run test:cov                 # Coverage report
pnpm run test:e2e                 # End-to-end tests (jest-e2e.json)
pnpm run test:debug               # Debug with node --inspect-brk

# Run single test file
pnpm test -- src/modules/jobs/job.service.spec.ts
pnpm test -- --testPathPattern=authentication.service

# Database
pnpm run seed:db                  # Seed database (node scripts/seed.js)
```

## Test Conventions

- **Unit tests**: `*.spec.ts` files co-located with source
- **E2E tests**: `*.e2e-spec.ts` in `/test` directory
- **Jest config**: In `package.json` (rootDir: `src`, pattern: `.*\.spec\.ts$`)
- **E2E config**: `test/jest-e2e.json` (rootDir: `.`)

## Code Style Guidelines

### TypeScript & Formatting

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

- Use `singleQuote` for strings
- Use `trailingComma` in multiline objects/arrays
- Maximum line length: 100 characters
- **Prettier is enforced as ESLint errors** (`prettier/prettier: error`)
- ESLint `endOfLine: auto` handles cross-platform line endings

### TypeScript Settings (tsconfig.json)

```json
{
  "strictNullChecks": true,
  "noImplicitAny": false,
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true
}
```

- Null checks are strict; always handle `null`/`undefined`
- `any` is allowed but avoid when possible
- Decorators enabled for class-validator/class-transformer

### ESLint Rules

- `@typescript-eslint/no-explicit-any`: OFF
- `@typescript-eslint/no-floating-promises`: WARN
- `@typescript-eslint/no-unsafe-argument`: WARN
- `@typescript-eslint/no-unused-vars`: ERROR (ignores rest siblings)

## Import Conventions

Organize imports in this order (enforced by automatic sorting):

```typescript
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

// External packages
import { IsEmail, IsNotEmpty } from 'class-validator';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcrypt';

// Internal imports (use 'src/' prefix)
import { JobSeekerRepository } from 'src/modules/job-seeker/repositories/job-seeker.repository';
import { CompanyRepository } from 'src/modules/company/repositories/company.repository';
```

## Naming Conventions

| Element          | Convention             | Example                        |
| ---------------- | ---------------------- | ------------------------------ |
| Classes          | PascalCase             | `AuthenticationService`        |
| Variables        | camelCase              | `accessToken`, `jobSeeker`     |
| DTOs             | PascalCase with suffix | `RegisterJobSeekerDto`         |
| Enums            | PascalCase             | `UserType`, `TokenType`        |
| Enum values      | UPPER_SNAKE_CASE       | `USER_TYPE.JOB_SEEKER`         |
| Files            | kebab-case             | `job-seeker.service.ts`        |
| Database columns | snake_case             | `created_at`, `user_id`        |
| API routes       | kebab-case plural      | `/job-seekers`, `/direct-jobs` |

## Module Architecture

```
src/
├── app.module.ts
├── main.ts
├── core/                    # Shared utilities
├── infrastructure/          # External services
│   ├── database/            # Prisma client
│   ├── redis/               # Redis client
│   ├── queue/               # BullMQ configuration
│   ├── email/               # Nodemailer transport
│   ├── cv-storage/          # S3/R2 presigned URLs
│   └── nlp/                 # CV parsing client
└── modules/
    ├── iam/                 # Authentication, OTP, JWT, hashing
    ├── job-seeker/          # Profile, skills, experience, education
    ├── company/              # Company profile, direct jobs
    ├── jobs/                 # Public job listings, bookmarks
    ├── cv/                   # CV upload/parse/confirm
    └── matching/             # Job matching logic
```

## Error Handling Pattern

```typescript
// ✅ Use NestJS built-in exceptions
throw new NotFoundException(`Job with ID ${jobId} not found`);
throw new UnauthorizedException('Invalid credentials');
throw new BadRequestException('Invalid input');
throw new ConflictException('Resource already exists');

// ✅ Catch and re-throw domain exceptions
try {
  const user = await this.userRepository.findByEmail(email);
} catch (err) {
  if (err instanceof HttpException) throw err;
  throw new InternalServerErrorException('Operation failed');
}

// ❌ Don't expose internal errors to clients
catch (err) {
  console.error(err);  // Log internally
  throw new InternalServerErrorException();  // Generic message only
}
```

## DTOs & Validation

Use `class-validator` decorators for all DTOs:

```typescript
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  skillIds: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  salaryMin?: number;
}
```

- Use `PartialType()` for update DTOs
- Use `PickType()` / `OmitType()` for subsets
- Always use `@Transform()` from class-transformer for query params

## Repository Pattern

```typescript
@Injectable()
export class JobSeekerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.jobSeeker.findUnique({ where: { email } });
  }

  async create(data: Prisma.JobSeekerCreateInput) {
    return this.prisma.jobSeeker.create({ data });
  }
}
```

- Repositories handle all database access
- Services use repositories, never Prisma directly
- Use Prisma's typed client from `generated/prisma`

## Queue Jobs (BullMQ)

```typescript
// Add job to queue
await this.emailQueue.add(JOB_NAME, payload as JobData, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
  removeOnComplete: true,
});

// Processor
@Processor(QUEUE_NAME)
export class EmailProcessor {
  @Process(JOB_NAME)
  async handleJob(job: Job<SendVerificationEmailJob>) {
    // Process job data
  }
}
```

## Guard & Decorator Usage

```typescript
// Use guards for auth
@UseGuards(JwtAuthGuard)

// Use decorators for roles
@Roles(UserType.COMPANY)
@UseGuards(JwtAuthGuard, RolesGuard)

// Extract user data
@Get('profile')
getProfile(@CurrentUser() user: ActiveUserData) {
  return { userId: user.sub, email: user.email };
}
```

## Configuration

Use `@nestjs/config` with typed configs:

```typescript
// jwt.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  issuer: process.env.JWT_ISSUER,
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
}));

// Usage
@Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>
```

## Testing Guidelines

```typescript
describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockRepository: jest.Mocked<JobSeekerRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: JobSeekerRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

- Use `jest.fn()` for simple mocks
- Use `jest.Mocked<T>` for typed mocks
- Co-locate spec files with source files
- Test happy path, errors, and edge cases

## Pre-commit Hooks

Husky runs lint-staged on commit:

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
}
```

- ESLint fixes are applied automatically
- Prettier formats code
- Both run on staged files only

## Key Files

| File                   | Purpose                            |
| ---------------------- | ---------------------------------- |
| `package.json`         | Scripts, dependencies, Jest config |
| `eslint.config.mjs`    | ESLint + Prettier configuration    |
| `.prettierrc`          | Prettier formatting rules          |
| `tsconfig.json`        | TypeScript compiler options        |
| `prisma/schema.prisma` | Database schema                    |
| `docs.json`            | Mintlify documentation navigation  |

## Documentation

- API docs built with Mintlify in `/docs`
- Run `pnpm run start:dev` and visit Mintlify local server
- Update `docs.json` to add new documentation pages
