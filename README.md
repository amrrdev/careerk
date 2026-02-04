<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

CareerK - A job platform API built with NestJS, PostgreSQL, and Redis.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8 or higher
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: For running PostgreSQL and Redis ([Download](https://www.docker.com/))

---

## Getting Started

Follow these steps to set up the project locally:

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd careerk
```

### 2️⃣ Install Dependencies

```bash
pnpm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# PostgreSQL
POSTGRES_DB=careerk_db
POSTGRES_USER=careerk
POSTGRES_PASSWORD=your_secure_postgres_password
DATABASE_URL=postgresql://careerk:your_secure_postgres_password@localhost:5432/careerk_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_TOKEN_AUDIENCE=localhost:3000
JWT_TOKEN_ISSUER=localhost:3000
JWT_ACCESS_TOKEN_TTL=3600
JWT_REFRESH_TOKEN_TTL=86400

# Redis
# Note: Wrap password in quotes if it contains special characters like # ! @
REDIS_PASSWORD="your_secure_redis_password"
REDIS_HOST=localhost
REDIS_PORT=6379

# BullMQ Queue (uses Redis)
QUEUE_HOST=localhost
QUEUE_PORT=6379
QUEUE_PASSWORD="your_secure_redis_password"

# Email (Gmail SMTP)
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_gmail_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

⚠️ **Important Notes:**
- If your Redis/Queue password contains special characters (`#`, `!`, `@`, etc.), you **must** wrap it in double quotes, otherwise the `.env` parser will treat `#` as a comment.
- For Gmail SMTP, you need to generate an [App Password](https://support.google.com/accounts/answer/185833) (not your regular Gmail password)
- BullMQ uses the same Redis instance as your application (you can use the same password)

### 4️⃣ Start Docker Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Pull the PostgreSQL 18 Alpine image
- Pull the Redis 7.4 Alpine image
- Create containers named `careerk-postgres` and `careerk-redis`
- Start the services on ports 5432 and 6379
- Create persistent volumes for data

**Verify services are running:**

```bash
docker ps
```

You should see both `careerk-postgres` and `careerk-redis` in the list.

### 5️⃣ Generate Prisma Client

Generate the Prisma Client based on your schema:

```bash
npx prisma generate
```

This creates the TypeScript types and client for your database models.

### 6️⃣ Run Database Migrations

Apply all pending migrations to create the database schema:

```bash
npx prisma migrate dev
```

### 7️⃣ Seed Database (Optional)

To populate the database with 30,000 job seekers and 30,000 companies:

```bash
# Copy SQL files to PostgreSQL container
docker cp prisma/seed/seed-job-seekers.sql careerk-postgres:/tmp/
docker cp prisma/seed/seed-companies.sql careerk-postgres:/tmp/

# Execute seed scripts
docker exec -it careerk-postgres psql -U careerk -d careerk_db -f /tmp/seed-job-seekers.sql
docker exec -it careerk-postgres psql -U careerk -d careerk_db -f /tmp/seed-companies.sql
```

Default seeded credentials:
- **Email:** Any seeded email (e.g., `john.smith123@gmail.com`)
- **Password:** `password123`

### 8️⃣ Start the Development Server

```bash
pnpm run start:dev
```

The API will be available at: **http://localhost:3000**

**You're ready to go! 🎉**

---

## Available Scripts

```bash
# Development mode with watch
pnpm run start:dev

# Production mode
pnpm run start:prod

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## API Documentation

### Authentication Endpoints

- `POST /auth/register/job-seeker` - Register a new job seeker
- `POST /auth/login` - Login (returns access + refresh tokens)
- `POST /auth/refresh-token` - Get new tokens using refresh token

### Features

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Refresh Token Rotation (Redis-based)
- ✅ Password Hashing (bcrypt)
- ✅ Role-based Authorization (Job Seeker / Company)
- ✅ Token Type Validation (prevents refresh token misuse)
- ✅ Secure token storage and invalidation
- ✅ Email verification with OTP (Redis-based)
- ✅ BullMQ job queue for async email sending
- ✅ Email templates with Nodemailer

---

## Docker Services

### PostgreSQL
- **Port:** 5432
- **Database:** `careerk_db`
- **User:** `careerk` (default)
- **Container:** `careerk-postgres`

### Redis
- **Port:** 6379
- **Used for:** Refresh token rotation, OTP storage, BullMQ job queue, and session management
- **Container:** `careerk-redis`

### Managing Docker Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Stop services and remove volumes (⚠️ deletes all data)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f postgres
docker-compose logs -f redis

# Access PostgreSQL shell
docker exec -it careerk-postgres psql -U careerk -d careerk_db

# Access Redis CLI
docker exec -it careerk-redis redis-cli -a "your_redis_password"

# Test Redis connection
docker exec -it careerk-redis redis-cli -a "your_redis_password" ping
```

---

## Project Architecture

See [Architecture.md](./Architecture.md) for detailed information about the project structure and design patterns.

Key architectural principles:
- Clean Architecture with separation of concerns
- Repository pattern for data access
- Dependency injection for loose coupling
- Infrastructure layer for external services (PostgreSQL, Redis)
- Domain-specific services in modules

---

## Troubleshooting

### Redis Connection Issues

**Error:** `WRONGPASS invalid username-password pair`

**Solutions:**
1. Check your `.env` file - wrap Redis password in quotes if it contains special characters
2. Restart Docker: `docker-compose down && docker-compose up -d`
3. Verify password: `docker exec -it careerk-redis redis-cli -a "your_password" ping`
4. Ensure `.env` file is in the same directory as `docker-compose.yml`

### Database Connection Issues

**Error:** Prisma can't connect to database

**Solutions:**
1. Verify Docker containers are running: `docker ps`
2. Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials
3. Ensure PostgreSQL is healthy: `docker-compose ps`
4. Check PostgreSQL logs: `docker-compose logs postgres`

### Tables Don't Exist

**Error:** `table does not exist in the current database`

**Solutions:**
```bash
# Reset database and run all migrations
npx prisma migrate reset

# Run pending migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy
```

### Port Already in Use

**Error:** Port 5432 or 6379 already in use

**Solutions:**
1. Check if PostgreSQL/Redis is already running locally
2. Stop local services or change ports in `docker-compose.yml`
3. Kill processes using the ports:
   ```bash
   # Windows
   netstat -ano | findstr :5432
   taskkill /PID <PID> /F
   ```

---

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).