## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **pnpm**: v8 or higher
  ```bash
  npm install -g pnpm
  ```
- **Docker & Docker Compose**: For running PostgreSQL ([Download](https://www.docker.com/))

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

```bash
# Copy from example (if exists) or create manually
touch .env
```

Add the following variables to your `.env` file:

```env
# Database Configuration
DATABASE_URL="postgresql://careerk:your_password@localhost:5432/careerk_db"

# PostgreSQL Docker Configuration
POSTGRES_DB=careerk_db
POSTGRES_USER=careerk
POSTGRES_PASSWORD=your_secure_password_here

```

**Important**: Replace `your_password` and `your_secure_password_here` with a strong password!

### 4️⃣ Start the Database (Docker)

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will:
- Pull the PostgreSQL 18 Alpine image
- Create a container named `careerk-postgres`
- Start the database on port 5432
- Create a persistent volume for data

**Verify the database is running:**

```bash
docker ps
```

You should see `careerk-postgres` in the list.

### 5️⃣ Generate Prisma Client

Generate the Prisma Client based on your schema:

```bash
pnpm prisma generate
```

This creates the TypeScript types and client for your database models.

### 6️⃣ Run Database Migrations

Apply all pending migrations to create the database schema:

```bash
pnpm prisma migrate deploy
```

**For development** (creates a new migration if schema changed):

```bash
pnpm prisma migrate dev
```

### 8️⃣ Start the Development Server

```bash
pnpm run start:dev
```

The API will be available at: **http://localhost:3000**

**You're ready to go!**
