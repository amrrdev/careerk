# Project Architecture

## Overview

This project follows a **layered architecture** pattern inspired by clean architecture principles. The main goal is to keep business logic independent from infrastructure concerns, making the codebase maintainable, testable, and scalable.

## Why This Architecture?

**Traditional Problem:**
Most NestJS projects throw everything together - Prisma code in services, Redis calls mixed with business logic, guards scattered everywhere. This creates tight coupling and makes testing painful.

**Our Solution:**
We separate concerns into distinct layers. Each layer has a specific job and doesn't know about implementation details of other layers.

## Core Principles

1. **Business logic doesn't know about databases** - Services work with interfaces, not Prisma directly
2. **Infrastructure is swappable** - Want to switch from Prisma to TypeORM? Change one folder
3. **Modules are independent** - job-seeker module works without knowing about company module
4. **Domain-specific global concerns live in their domain** - IAM guards/decorators stay in IAM module even though they're used everywhere

## Folder Structure

### `/src/modules` - Business Domains

This is where your application logic lives. Each module represents a business domain.

```ts
modules/
├── iam/              # Identity & Access Management (auth/authz)
├── job-seeker/       # Job seeker domain
├── company/          # Company domain
├── api-key/          # API key management
└── recommendations/  # Recommendation engine
```

**What goes here:**

- Business entities (User, Company, Job)
- Business rules (validation, calculations)
- API endpoints (controllers)
- Application services
- Domain-specific concerns that are used globally (like IAM)

**What doesn't go here:**

- Generic infrastructure (database connections, Redis setup)
- Generic utilities (logging, error formatting)

### Module Internal Structure

Every module follows the same pattern:

```ts
job-seeker/
├── types/                          # Domain types (Prisma-independent)
│   └── job-seeker.types.ts
├── dto/                            # API request/response shapes
│   ├── create-job-seeker.dto.ts
│   └── job-seeker-response.dto.ts
├── repositories/                   # Data access interfaces
│   ├── job-seeker.repository.ts    # Interface (what we need)
│   └── job-seeker.repository.impl.ts # Implementation (how we do it)
├── workers/                        # Async jobs/background workers (optional)
│   └── job-seeker.worker.ts
├── job-seeker.service.ts           # Business logic
├── job-seeker.controller.ts        # HTTP endpoints
└── job-seeker.module.ts            # Wires everything together
```

**When adding new features:**

- New API endpoint? → Add to controller
- New business rule? → Add to service
- New database query? → Add to repository interface, implement in .impl
- New request format? → Create DTO
- Prisma model changed? → Update types file
- New background job? → Add to workers/

### Special Case: IAM Module (Identity & Access Management)

The IAM module is special - it contains authentication and authorization logic that's **used globally across the entire application**, but it's still a **domain module**, not infrastructure.

```ts
modules/
├── iam/
│   ├── decorators/                    # Used everywhere, but IAM-specific
│   │   ├── auth.decorator.ts         # @Auth(AuthType.Bearer)
│   │   ├── current-user.decorator.ts # @CurrentUser()
│   │   ├── roles.decorator.ts        # @Roles('admin')
│   │   └── public.decorator.ts       # @Public()
│   │
│   ├── guards/                        # Registered globally via APP_GUARD
│   │   ├── auth.guard.ts             # Main authentication guard
│   │   ├── roles.guard.ts            # Authorization guard
│   │   ├── jwt-auth.guard.ts         # JWT strategy guard
│   │   └── api-key-auth.guard.ts     # API key strategy guard
│   │
│   ├── strategies/                    # Passport strategies
│   │   ├── jwt.strategy.ts
│   │   └── api-key.strategy.ts
│   │
│   ├── enums/
│   │   └── auth-type.enum.ts         # AuthType.Bearer, AuthType.ApiKey
│   │
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   │
│   ├── iam.service.ts
│   ├── iam.controller.ts
│   └── iam.module.ts                  # Provides APP_GUARD providers
```

### Understanding: Why IAM is in modules/, not core/

**The Confusion:**
"If IAM decorators and guards are used everywhere in the application, shouldn't they be in the `core/` folder with other global concerns?"

**The Answer: No. Here's why:**

The key distinction is not **"where it's used"** but **"what it knows about"**.

| Question                          | IAM Module | Core   |
| --------------------------------- | ---------- | ------ |
| Used everywhere?                  | ✅ Yes     | ✅ Yes |
| Generic/reusable in ANY project?  | ❌ No      | ✅ Yes |
| Knows about YOUR business domain? | ✅ Yes     | ❌ No  |
| Has business logic?               | ✅ Yes     | ❌ No  |
| Needs heavy configuration?        | ✅ Yes     | ❌ No  |

**Examples to clarify:**

**IAM decorators (domain-specific):**

- `@Auth(AuthType.Bearer)` - Knows about YOUR authentication types
- `@CurrentUser()` - Knows about YOUR user structure
- `@Roles(UserRole.ADMIN)` - Knows about YOUR role system
- These contain logic specific to YOUR application's security requirements

**Core utilities (generic):**

- `@UseInterceptors(LoggingInterceptor)` - Generic request logging, works in any app
- `@UsePipes(ValidationPipe)` - Generic validation, works in any app
- Could copy these to a completely different project and they'd work as-is

**The Rule:**

- **Used everywhere + Generic for any project** → `core/`
- **Used everywhere + Specific to your domain** → Domain module (IAM)
- **Used in one place + Any logic** → That specific module

**Why this matters:**

- IAM guards know about YOUR JWT secrets, YOUR role definitions, YOUR user model
- They implement YOUR security policies
- They're tightly coupled to YOUR business requirements
- Putting them in `core/` would mix domain logic with infrastructure

**In practice:**
Other modules will import from IAM, and that's perfectly fine and expected:

The job-seeker controller imports IAM decorators to protect routes. The company controller imports IAM decorators to check roles. This cross-module importing is natural and correct - IAM provides security services for the entire application.

### `/src/infra` - Infrastructure Layer

External services and tools that our application depends on. This layer contains **generic infrastructure** with no business logic.

```ts
infra/
├── database/
│   ├── database.service.ts        # Prisma client setup
│   └── database.module.ts
├── redis/
│   ├── redis.service.ts           # Redis client setup
│   └── redis.module.ts
├── queue/                          # BullMQ setup
│   ├── queue.service.ts
│   ├── queue.module.ts
│   └── workers/                    # Generic workers only
│       ├── email.worker.ts        # Generic email sender
│       └── notification.worker.ts  # Generic notifications
└── infra.module.ts
```

**What goes here:**

- Database connection setup (Prisma, TypeORM)
- Redis client configuration
- Queue (BullMQ) setup
- Email service integration (SendGrid, Mailgun)
- S3/storage clients
- Third-party API clients (Stripe, Twilio)
- **Generic, reusable workers** (email, SMS, notifications)

**What doesn't go here:**

- Business logic
- Domain-specific workers (those go in module/workers/)
- Authentication logic (that's in IAM module)

**Key principle:** Infrastructure doesn't contain business logic. It just connects to external services and provides basic operations.

**Understanding Workers: Infra vs Modules**

Workers can live in two places depending on what they do:

**Infra workers (generic):**

- Generic email worker - sends any email with to/subject/body
- Generic SMS worker - sends any SMS with phone/message
- Generic notification worker - sends any notification
- These know nothing about your business domain
- Reusable across any module

**Module workers (domain-specific):**

- Job seeker resume processing - parses resumes, extracts skills, updates profile
- Company verification worker - verifies company documents, updates status
- Recommendation engine worker - calculates job matches based on algorithms
- These contain business logic specific to the domain
- Live in the module they belong to

**The rule:** If the worker contains business logic or knows about domain entities, it goes in the module. If it's a generic utility, it goes in infra.

### `/src/core` - Generic Cross-Cutting Concerns

Things that apply across the entire application that are **generic and reusable in ANY project**.

```ts
core/
├── interceptors/
│   ├── logging.interceptor.ts      # Log every HTTP request
│   ├── timeout.interceptor.ts      # Request timeout handling
│   └── transform.interceptor.ts    # Transform all responses
├── filters/
│   ├── http-exception.filter.ts    # Format HTTP errors
│   ├── prisma-exception.filter.ts  # Handle Prisma errors
│   └── all-exceptions.filter.ts    # Catch-all error handler
├── guards/
│   ├── throttle.guard.ts           # Rate limiting
│   └── maintenance.guard.ts        # Maintenance mode
├── pipes/
│   ├── validation.pipe.ts          # Request validation
│   └── parse-objectid.pipe.ts      # Parse MongoDB ObjectIds
├── decorators/
│   └── api-paginated-response.decorator.ts  # Swagger pagination
└── middleware/
    └── logger.middleware.ts         # Request/response logging
```

**What goes here:**

- Generic request/response transformation
- Generic error handling
- Generic rate limiting
- Generic logging
- Generic validation
- Generic utilities that work in ANY NestJS app

**What doesn't go here:**

- Authentication guards (those are in IAM module - domain-specific)
- Authorization guards (those are in IAM module - domain-specific)
- Business-specific interceptors
- Domain decorators (like @CurrentUser - that's in IAM)

**Examples:**

**Belongs in Core:**

- Logging interceptor - logs request method and URL (works anywhere)
- Timeout interceptor - cancels requests after 30 seconds (works anywhere)
- HTTP exception filter - formats error responses consistently (works anywhere)
- Validation pipe - validates DTOs using class-validator (works anywhere)

**Doesn't belong in Core:**

- Auth guard - knows about YOUR JWT strategy, YOUR auth types (IAM module)
- Roles guard - knows about YOUR role definitions (IAM module)
- CurrentUser decorator - knows about YOUR user structure (IAM module)
- Job matching algorithm - knows about YOUR business domain (recommendations module)

### `/src/common` - Shared Utilities

Stuff used across multiple modules but not global enough for core.

```ts
common/
├── constants/
│   ├── error-messages.constant.ts  # Application-wide error messages
│   └── regex-patterns.constant.ts  # Shared regex patterns
├── enums/
│   ├── user-role.enum.ts           # User roles (Admin, JobSeeker, Company)
│   └── job-status.enum.ts          # Job statuses (Active, Closed, Draft)
├── interfaces/
│   ├── pagination.interface.ts     # Pagination response structure
│   └── api-response.interface.ts   # Standard API response format
└── utils/
    ├── date.util.ts                # Date formatting utilities
    ├── string.util.ts              # String manipulation helpers
    └── validation.util.ts          # Shared validation functions
```

**What goes here:**

- Shared constants used across multiple modules
- Enums that multiple modules need to reference
- Interfaces for common patterns (pagination, responses)
- Utility functions used in multiple places

**When to use common vs core:**

- **Common** - Shared values and structures specific to your app
- **Core** - Generic infrastructure that works in any app

## Dependency Flow

Understanding who can import from whom:

```ts
┌─────────┐
│ modules │ → Can import: infra, core, common, other modules
└─────────┘
     ↓
┌─────────┐
│  infra  │ → Can import: core, common,
└─────────┘   → CANNOT import: modules (prevents circular dependencies)
     ↓
┌─────────┐
│  core   │ → Can import: common,
└─────────┘   → CANNOT import: modules, infra
     ↓
┌─────────┐
│ common  │ → CANNOT import: modules, infra, core
└─────────┘
```

**Critical Rules:**

1. **Modules can import from other modules** - This is fine and expected
   - Job seeker module imports from IAM module for auth decorators
   - Company module imports from job-seeker module if needed
   - This is natural cross-domain communication

2. **Infra NEVER imports from modules** - Would create circular dependencies
   - Infra provides services TO modules, not the other way around
   - Keeps infrastructure independent and swappable

3. **Core NEVER imports from modules** - Would mix concerns
   - Core is generic, modules are specific
   - Core should work in any project

4. **Common NEVER imports from modules** - Would create dependencies
   - Common is for shared values, not business logic
   - Should be simple, stable, and independent

## Common Mistakes to Avoid

### ❌ Mistake 1: Putting Prisma calls directly in services

**Why it's wrong:** Services become tightly coupled to Prisma. Can't test without database. Can't swap Prisma for another ORM.

**The fix:** Always use repository pattern. Services call repositories, repositories call Prisma.

### ❌ Mistake 2: Putting domain-specific guards in core/

**Why it's wrong:** Core should be generic. Auth guards know about YOUR users and roles - that's domain logic.

**The fix:** Keep authentication/authorization in IAM module. Core only gets truly generic guards like rate limiting.

### ❌ Mistake 3: Business logic in controllers

**Why it's wrong:** Controllers should be thin routing layers. Testing business logic requires HTTP tests.

**The fix:** Controllers validate input and call services. All business logic lives in services.

### ❌ Mistake 4: Module-specific workers in infra/

**Why it's wrong:** Workers that process resumes or calculate matches contain business logic specific to your domain.

**The fix:** Generic workers (email, SMS) go in infra. Domain-specific workers go in their module's workers folder.

### ❌ Mistake 5: Importing from modules into infra

**Why it's wrong:** Creates circular dependencies. Infra provides services TO modules, not vice versa.

**The fix:** Keep infra independent. If infra needs domain knowledge, you're doing it wrong.

## Quick Decision Guide

**Where should I put this new file?**

### Adding authentication logic?

→ **IAM module** (modules/iam/)

- Guards, decorators, strategies all go here
- Even though used everywhere, they're domain-specific

### Adding a new business feature?

→ **New module** (modules/feature-name/)

- Create full structure: types, dto, repositories, services, controllers

### Adding background job?

→ **Ask: Is it generic or domain-specific?**

- Generic (sends any email) → infra/queue/workers/
- Domain-specific (processes resumes) → modules/feature/workers/

### Adding a new database/external service?

→ **Infra** (infra/service-name/)

- Just connection logic, no business rules

### Adding something used globally?

→ **Ask: Does it know about my business domain?**

- Yes (auth, roles) → Domain module (IAM)
- No (logging, formatting) → Core

### Adding shared constants/enums/utils?

→ **Common** (common/constants or common/utils)

- Values and utilities used across modules

### Adding configuration?

→ **Config** (config/feature.config.ts)

- Just values from environment, no logic

## Benefits We Get

✅ **Can test without database** - Mock repositories in unit tests

✅ **Can swap Prisma for TypeORM** - Change only repository implementations

✅ **Modules don't break each other** - Independent, loose coupling

✅ **New developers onboard faster** - Consistent structure everywhere, clear conventions

✅ **Code reviews are easier** - Know exactly where code should go

✅ **Refactoring is safer** - Change one layer without breaking others

✅ **IAM changes don't affect business modules** - Even though they use IAM decorators

✅ **Can extract modules as microservices** - Each module is self-contained

✅ **Infrastructure is swappable** - Replace Redis, change queue system, switch databases

✅ **Generic code is reusable** - Core utilities work in any project

---

**Remember:** Architecture is not about being fancy or following rules blindly. It's about:

- Knowing where things go without thinking
- Making changes without fear of breaking stuff
- Testing easily without complex setup
- Onboarding new developers quickly
- Sleeping well at night knowing your future self won't hate you

The key insight: **"Used everywhere" does not mean "put in core"**. It means "ask if it's generic or domain-specific first."
