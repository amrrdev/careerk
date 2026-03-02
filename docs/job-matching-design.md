# Job Matching Service Design

## Overview

This document describes the job matching service architecture and flows for matching job seekers with jobs.

## Matching Types

The system supports two types of job matching:

1. **Direct Job Matching** - For company-posted jobs
2. **Scraped Job Matching** - For externally scraped jobs

---

## Direct Job Matching

### Trigger

When a company publishes a job via `POST /companies/me/jobs/:jobId/publish`, the matching service is invoked.

### Flow

```
Company calls publish endpoint
        │
        ▼
DirectJob status changes to PUBLISHED
        │
        ▼
Trigger Direct Job Matching Service
        │
        ▼
Fetch all relevant job seekers:
  - Skills matching (required skills from job)
  - Availability status = OPEN_TO_WORK or PASSIVELY_LOOKING
  - Work preference matching
  - Location preference matching
        │
        ▼
For each matching job seeker:
  Calculate weighted match score:
    - Skills: 60%
    - Experience Level: 20%
    - Work Preference: 10%
    - Location: 10%
        │
        ▼
Save match to DirectJobMatch table
  (upsert if already exists)
        │
        ▼
Return match results to company
```

### Matching Criteria

| Field            | Weight | Description                                                           |
| ---------------- | ------ | --------------------------------------------------------------------- |
| Skills           | 60%    | Percentage of required job skills that job seeker possesses           |
| Experience Level | 20%    | Match between job's experience level and seeker's years of experience |
| Work Preference  | 10%    | Match between job's work preference and seeker's preference           |
| Location         | 10%    | Location matching (exact, same city, remote-any)                      |

---

## Scraped Job Matching

### Trigger

The scraper (external process) calls the matching service after scraping new jobs.

### Flow

```
Scraper completes scraping new jobs
        │
        ▼
Scraper calls matching service with lastScrapeTimestamp
        │
        ▼
Fetch all ScrapedJob records created after lastScrapeTimestamp
        │
        ▼
For each new scraped job:
  Fetch all relevant job seekers:
    - Skills matching (skills from job)
    - Availability status = OPEN_TO_WORK or PASSIVELY_LOOKING
        │
        ▼
  For each matching job seeker:
    Calculate skills-only match score:
      (matched skills / total job skills) × 100
        │
        ▼
    Save match to ScrapedJobMatch table
      (upsert if already exists)
        │
        ▼
Return match summary to scraper
```

### API Endpoint

```
POST /matching/scraped-jobs
Content-Type: application/json
Authorization: Bearer <scraper_api_key>

{
  "lastScrapeTimestamp": "2026-03-03T10:00:00.000Z"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "jobsProcessed": 25,
    "totalMatchesCreated": 150,
    "timestamp": "2026-03-03T10:30:00.000Z"
  }
}
```

---

## Data Models

### DirectJobMatch

| Field       | Type         | Description                  |
| ----------- | ------------ | ---------------------------- |
| id          | UUID         | Primary key                  |
| directJobId | UUID         | Reference to DirectJob       |
| jobSeekerId | UUID         | Reference to JobSeeker       |
| matchScore  | Decimal(5,2) | Weighted match score (0-100) |
| createdAt   | DateTime     | When match was created       |
| updatedAt   | DateTime     | Last update timestamp        |

### ScrapedJobMatch

| Field        | Type         | Description                     |
| ------------ | ------------ | ------------------------------- |
| id           | UUID         | Primary key                     |
| scrapedJobId | UUID         | Reference to ScrapedJob         |
| jobSeekerId  | UUID         | Reference to JobSeeker          |
| matchScore   | Decimal(5,2) | Skills match percentage (0-100) |
| createdAt    | DateTime     | When match was created          |
| updatedAt    | DateTime     | Last update timestamp           |

---

## API Endpoints

### 1. Trigger Scraped Job Matching

```
POST /matching/scraped-jobs
```

**Request:**

```json
{
  "lastScrapeTimestamp": "2026-03-03T10:00:00.000Z"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "jobsProcessed": 25,
    "totalMatchesCreated": 150,
    "timestamp": "2026-03-03T10:30:00.000Z"
  }
}
```

### 2. Get Job Seeker Matches

```
GET /job-seekers/me/matches?type=direct&page=1&limit=10
```

**Query Parameters:**

- `type`: "direct" | "scraped" | "all"
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "uuid",
        "jobId": "uuid",
        "jobTitle": "Senior Software Engineer",
        "companyName": "Tech Corp",
        "matchScore": 85.5,
        "jobSource": "DIRECT",
        "createdAt": "2026-03-03T10:30:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### 3. Get Direct Job Matches (Company)

```
GET /companies/me/jobs/:jobId/matches?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "uuid",
        "jobSeekerId": "uuid",
        "jobSeekerName": "John Doe",
        "matchScore": 85.5,
        "matchedSkills": ["TypeScript", "NestJS", "PostgreSQL"],
        "missingSkills": ["AWS", "Docker"],
        "createdAt": "2026-03-03T10:30:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

## Matching Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Matching Service                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐    ┌──────────────────┐              │
│  │ DirectJobMatcher  │    │ ScrapedJobMatcher │              │
│  │                  │    │                   │              │
│  │ - Skills         │    │ - Skills Only     │              │
│  │ - Experience     │    │                   │              │
│  │ - Work Pref      │    │                   │              │
│  │ - Location       │    │                   │              │
│  └────────┬─────────┘    └────────┬─────────┘              │
│           │                        │                        │
│           ▼                        ▼                        │
│  ┌──────────────────────────────────────────┐               │
│  │           Score Calculator               │               │
│  │                                          │               │
│  │  Direct: Weighted average               │               │
│  │  Scraped: Simple skill %                 │               │
│  └──────────────────────────────────────────┘               │
│                       │                                      │
│                       ▼                                      │
│  ┌──────────────────────────────────────────┐               │
│  │         Match Repository                 │               │
│  │                                          │               │
│  │  - Upsert matches                        │               │
│  │  - Query matches                         │               │
│  └──────────────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Cron Job Schedule

For scraped job matching, set up a cron job:

```
# Run every hour
0 * * * *
```

The cron will call the matching service without a timestamp (fetching all unmatched jobs).

**Alternative:** The scraper can trigger matching immediately after each scrape cycle completes.

---

## Notes

- Match scores are recalculated when jobs are republished or skills are updated
- Old matches are preserved but can be re-evaluated on demand
- Job seekers can hide/disable matches they don't want to see
- Company can filter matches by minimum score threshold
