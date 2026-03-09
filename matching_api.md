# Matching Callback README

This file documents the 2 webhook endpoints that the Python matcher calls on the Nest backend after matching finishes.

This is only about these 2 endpoints:

- `POST /internal/matching/direct/completed`
- `POST /internal/matching/scraped/completed`

These are callback endpoints.
They are not called by the frontend.
They are called by the matcher service.

## Important Notes

- Base URL in local development: `http://localhost:3000`
- Full direct callback URL: `http://localhost:3000/internal/matching/direct/completed`
- Full scraped callback URL: `http://localhost:3000/internal/matching/scraped/completed`
- Request content type: `application/json`
- These endpoints currently use no auth in Nest
- These endpoints always return a simple acknowledgement when the payload is valid
- There is no `/api/v1` prefix in the current Nest app

## What Each Endpoint Does

### 1. Direct callback

Endpoint:

```http
POST /internal/matching/direct/completed
```

Used when:

- a company publishes a direct job
- Nest calls the matcher
- matcher finishes direct-job matching
- matcher calls this endpoint back

What Nest does after receiving this callback:

- validates the JSON body with `DirectJobWebhookBodyDto`
- checks whether the payload is `completed` or `failed`
- if `completed`, queues a company email notification
- if `failed`, logs the failure and still returns acknowledgement

Relevant files:

- [matching_api.md](/A:/graudation-project/careerk/matching_api.md)
- [webhook.controller.ts](/A:/graudation-project/careerk/src/modules/matching/webhook/webhook.controller.ts)
- [webhook.service.ts](/A:/graudation-project/careerk/src/modules/matching/webhook/webhook.service.ts)
- [direct-job.dto.ts](/A:/graudation-project/careerk/src/modules/matching/dto/direct-job.dto.ts)
- [direct-job-webhook.types.ts](/A:/graudation-project/careerk/src/modules/matching/types/direct-job-webhook.types.ts)
- [matching.repository.impl.ts](/A:/graudation-project/careerk/src/modules/matching/repository/matching.repository.impl.ts)
- [email.processor.ts](/A:/graudation-project/careerk/src/modules/matching/processors/email.processor.ts)
- [email.service.ts](/A:/graudation-project/careerk/src/infrastructure/email/email.service.ts)

### 2. Scraped callback

Endpoint:

```http
POST /internal/matching/scraped/completed
```

Used when:

- the scraper calls the matcher with a scrape window
- matcher finishes scraped-job matching
- matcher calls this endpoint back

What Nest does after receiving this callback:

- validates the JSON body with `ScrapedJobWebhookBodyDto`
- checks whether the payload is `completed` or `failed`
- if `completed`, finds job seekers affected by the run
- queues one email per job seeker
- if `failed`, logs the failure and still returns acknowledgement

Relevant files:

- [matching_api.md](/A:/graudation-project/careerk/matching_api.md)
- [webhook.controller.ts](/A:/graudation-project/careerk/src/modules/matching/webhook/webhook.controller.ts)
- [webhook.service.ts](/A:/graudation-project/careerk/src/modules/matching/webhook/webhook.service.ts)
- [scraped-job-webhook.dto.ts](/A:/graudation-project/careerk/src/modules/matching/dto/scraped-job-webhook.dto.ts)
- [scraped-job-webhook.types.ts](/A:/graudation-project/careerk/src/modules/matching/types/scraped-job-webhook.types.ts)
- [matching.repository.impl.ts](/A:/graudation-project/careerk/src/modules/matching/repository/matching.repository.impl.ts)
- [email.processor.ts](/A:/graudation-project/careerk/src/modules/matching/processors/email.processor.ts)
- [email.service.ts](/A:/graudation-project/careerk/src/infrastructure/email/email.service.ts)

## Direct Callback Request Body

The matcher must send one of these 2 shapes to:

```http
POST /internal/matching/direct/completed
```

### Direct success body

```json
{
  "type": "direct",
  "status": "completed",
  "jobId": "uuid",
  "requestId": "string",
  "processedJobs": 1,
  "processedCandidates": 120,
  "upsertedMatches": 65,
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Field meanings:

- `type`: must be exactly `"direct"`
- `status`: must be exactly `"completed"`
- `jobId`: the direct job ID in the Nest database
- `requestId`: matcher-generated request ID for tracing
- `processedJobs`: usually `1` for direct job matching
- `processedCandidates`: how many job seekers were evaluated
- `upsertedMatches`: how many match rows were inserted or updated
- `startedAt`: ISO datetime string
- `finishedAt`: ISO datetime string

### Direct failure body

```json
{
  "type": "direct",
  "status": "failed",
  "jobId": "uuid",
  "requestId": "string",
  "error": "short reason",
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Field meanings:

- same as success body, except:
- `status` is `"failed"`
- `error` explains why matching failed

## Direct Callback Response

If Nest accepts the body, it responds with:

```json
{
  "status": "received"
}
```

HTTP status:

- `201 Created` by default in Nest for `@Post()` unless changed

Important:

- the matcher should treat this as acknowledgement only
- it does not mean an email was already sent
- it means Nest accepted the callback and queued the next step

## Scraped Callback Request Body

The matcher must send one of these 2 shapes to:

```http
POST /internal/matching/scraped/completed
```

### Scraped success body

```json
{
  "type": "scraped",
  "status": "completed",
  "since": "2026-03-09T14:50:05.347Z",
  "until": "2026-03-09T14:55:49.627Z",
  "requestId": "scraper-1773068149628-07e9a312-6efa-4651-9f50-f367f4788239",
  "processedJobs": 35,
  "processedCandidates": 120,
  "upsertedMatches": 105,
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Field meanings:

- `type`: must be exactly `"scraped"`
- `status`: must be exactly `"completed"`
- `since`: scrape window start, ISO datetime string
- `until`: scrape window end, ISO datetime string
- `requestId`: matcher-generated request ID for tracing
- `processedJobs`: how many scraped jobs were evaluated
- `processedCandidates`: how many job seekers were evaluated
- `upsertedMatches`: how many match rows were inserted or updated
- `startedAt`: when the matcher started this matching run
- `finishedAt`: when the matcher finished this matching run

### Scraped failure body

```json
{
  "type": "scraped",
  "status": "failed",
  "since": "2026-03-09T14:50:05.347Z",
  "until": "2026-03-09T14:55:49.627Z",
  "requestId": "scraper-1773068149628-07e9a312-6efa-4651-9f50-f367f4788239",
  "error": "short reason",
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Field meanings:

- same as success body, except:
- `status` is `"failed"`
- `error` explains why matching failed

## Scraped Callback Response

If Nest accepts the body, it responds with:

```json
{
  "status": "received"
}
```

HTTP status:

- `201 Created` by default in Nest for `@Post()` unless changed

Important:

- the matcher should treat this as acknowledgement only
- it does not mean job seeker emails were already delivered
- it means Nest accepted the callback and queued the next step

## Required Matcher Environment Variables

The matcher must have both callback URLs configured.

Required:

```env
MATCHING_DIRECT_CALLBACK_URL=http://localhost:3000/internal/matching/direct/completed
MATCHING_SCRAPED_CALLBACK_URL=http://localhost:3000/internal/matching/scraped/completed
```

Optional if token auth is added later:

```env
MATCHING_DIRECT_CALLBACK_TOKEN=...
MATCHING_SCRAPED_CALLBACK_TOKEN=...
```

If `MATCHING_SCRAPED_CALLBACK_URL` is missing:

- scraped matching still happens
- matcher still logs success
- Nest receives nothing
- Nest logs nothing
- no job seeker emails are queued

## How To Test Manually

### Test direct callback

```http
POST http://localhost:3000/internal/matching/direct/completed
Content-Type: application/json
```

```json
{
  "type": "direct",
  "status": "completed",
  "jobId": "PUT_REAL_DIRECT_JOB_ID_HERE",
  "requestId": "manual-test-direct-001",
  "processedJobs": 1,
  "processedCandidates": 12,
  "upsertedMatches": 5,
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Expected Nest behavior:

- controller accepts request
- service logs direct matching completion
- matching queue gets one company email job

### Test scraped callback

```http
POST http://localhost:3000/internal/matching/scraped/completed
Content-Type: application/json
```

```json
{
  "type": "scraped",
  "status": "completed",
  "since": "2026-03-09T14:50:05.347Z",
  "until": "2026-03-09T14:55:49.627Z",
  "requestId": "manual-test-scraped-001",
  "processedJobs": 35,
  "processedCandidates": 120,
  "upsertedMatches": 105,
  "startedAt": "2026-03-09T16:55:49.631Z",
  "finishedAt": "2026-03-09T16:55:51.939Z"
}
```

Expected Nest behavior:

- controller accepts request
- service logs scraped matching completion
- service queries `scraped_job_matches`
- matching queue gets one email job per job seeker found for that run

## What Your Friend Must Not Miss

- `type` and `status` are strict string values
- datetime strings must be valid ISO strings
- the scraped callback URL must be configured separately from the direct callback URL
- the current Nest route has no `/api/v1` prefix
- the response body is only:

```json
{
  "status": "received"
}
```

- direct and scraped callbacks are different endpoints and different payloads
- if the matcher only sends the direct callback, company emails can work while job seeker emails never run
