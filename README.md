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

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose

## Project Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd careerk
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Variables

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
```

⚠️ **Important:** If your Redis password contains special characters (`#`, `!`, `@`, etc.), you **must** wrap it in double quotes, otherwise the `.env` parser will treat `#` as a comment.

### 4. Start Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker ps
```

### 5. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```
## Compile and Run the Project

```bash

# development watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- `POST /auth/register/job-seeker` - Register a new job seeker
- `POST /auth/login` - Login (returns access + refresh tokens)
- `POST /auth/refresh-token` - Get new tokens using refresh token

### Features

- ✅ JWT Authentication (Access + Refresh tokens)
- ✅ Refresh Token Rotation (Redis-based)
- ✅ Password Hashing (bcrypt)
- ✅ Role-based Authentication (Job Seeker / Company)
- ✅ Token Type Validation (prevents refresh token misuse)

## Docker Services

### PostgreSQL
- **Port:** 5432
- **Database:** careerk_db
- **User:** careerk (default)

### Redis
- **Port:** 6379
- **Used for:** Refresh token rotation and caching

### Managing Docker Services

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Access PostgreSQL shell
docker exec -it careerk-postgres psql -U careerk -d careerk_db

# Access Redis CLI
docker exec -it careerk-redis redis-cli -a "your_redis_password"
```

## Run Tests

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

## Project Architecture

See [Architecture.md](./Architecture.md) for detailed information about the project structure and design patterns.

## Troubleshooting

### Redis Connection Issues

If you see `WRONGPASS invalid username-password pair`:
1. Check your `.env` file - wrap Redis password in quotes if it contains special characters
2. Restart Docker: `docker-compose down && docker-compose up -d`
3. Verify password: `docker exec -it careerk-redis redis-cli -a "your_password" ping`

### Database Connection Issues

If Prisma can't connect:
1. Verify Docker containers are running: `docker ps`
2. Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials
3. Run migrations: `npx prisma migrate dev`

### Tables Don't Exist

If you see "table does not exist" errors:
```bash
npx prisma migrate reset  # Resets database and runs all migrations
npx prisma migrate dev    # Runs pending migrations
```

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
