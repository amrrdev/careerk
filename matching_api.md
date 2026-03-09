 Final Flow

  - Nest -> Matcher: POST /match/direct-job
  - Scraper -> Matcher: POST /match/scraped-jobs
  - Matcher -> Nest: POST /internal/matching/direct/completed
  - Matcher -> Nest: POST /internal/matching/scraped/completed

  Both matching trigger endpoints are async now. They return 202 Accepted immediately. The real finished/failed signal is the webhook from
  matcher to Nest.

  Endpoints Reference
  Matcher service base URL:

  - http://<python-service>:8000

  Matcher endpoints:

  - POST /parse-cv
    Request:

    { "url": "presigned-url", "jobSeekerId": "uuid" }
  
  - POST /match/direct-job
    Called by Nest.
    Request:

    { "jobId": "uuid", "requestId": "optional-string" }
    Immediate response:

    {
      "type": "direct",
      "status": "accepted",
      "requestId": "generated-or-forwarded-id",
      "jobId": "uuid",
      "acceptedAt": "2026-03-08T23:00:00Z"
    }
  - POST /match/scraped-jobs
    Called by Scraper.
    Request:

    {
      "since": "2026-03-08T10:00:00Z",
      "until": "2026-03-08T11:00:00Z",
      "requestId": "optional-string"
    }
    Immediate response:

    {
      "type": "scraped",
      "status": "accepted",
      "requestId": "generated-or-forwarded-id",
      "since": "2026-03-08T10:00:00Z",
      "until": "2026-03-08T11:00:00Z",
      "acceptedAt": "2026-03-08T23:00:00Z"
    }

  Nest webhook endpoints you need:

  - POST /internal/matching/direct/completed
  - POST /internal/matching/scraped/completed

  Matcher -> Nest direct success payload:

  {
    "type": "direct",
    "status": "completed",
    "jobId": "uuid",
    "requestId": "string",
    "processedJobs": 1,
    "processedCandidates": 120,
    "upsertedMatches": 120,
    "startedAt": "2026-03-08T23:00:00Z",
    "finishedAt": "2026-03-08T23:00:12Z"
  }

  Matcher -> Nest scraped success payload:

  {
    "type": "scraped",
    "status": "completed",
    "since": "2026-03-08T10:00:00Z",
    "until": "2026-03-08T11:00:00Z",
    "requestId": "string",
    "processedJobs": 35,
    "processedCandidates": 120,
    "upsertedMatches": 4200,
    "startedAt": "2026-03-08T23:00:00Z",
    "finishedAt": "2026-03-08T23:02:10Z"
  }

  Matcher -> Nest failure payload, same endpoint by type:

  {
    "type": "direct",
    "status": "failed",
    "jobId": "uuid",
    "requestId": "string",
    "error": "short reason",
    "startedAt": "2026-03-08T23:00:00Z",
    "finishedAt": "2026-03-08T23:00:03Z"
  }

  Scraper side:

  - The scraper only needs to call POST /match/scraped-jobs
  - It does not need a webhook endpoint for matching

  Nest side:

  - It needs to call POST /match/direct-job
  - It needs to expose the two completion webhook endpoints above

  Config
  Set these in the Python service:

  - MATCHING_DIRECT_CALLBACK_URL=http://<nest>/internal/matching/direct/completed
  - MATCHING_DIRECT_CALLBACK_TOKEN=<optional>
  - MATCHING_SCRAPED_CALLBACK_URL=http://<nest>/internal/matching/scraped/completed
  - MATCHING_SCRAPED_CALLBACK_TOKEN=<optional>
  - MATCHING_LOCAL_FILES_ONLY=true
  - PARSER_LOCAL_FILES_ONLY=true

  Run the unified service with:

  .\.venv\Scripts\uvicorn.exe main:app --host 0.0.0.0 --port 8000
