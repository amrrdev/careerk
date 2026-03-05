// Company publishes job
POST /companies/me/jobs/:jobId/publish

→ Job status changes to PUBLISHED
→ Trigger matching immediately:

- Find all active job seekers (OPEN_TO_WORK + PASSIVELY_LOOKING)
- Calculate match scores
- Store in direct_job_matches
  → Company sees: "Found 234 candidates! 34 high matches (80+)"

// Cron job runs every hour
Scraper adds 150 new jobs
→ Trigger matching:

- For each new scraped job
- For each active job seeker
- Calculate match scores
- Store in scraped_job_matches
  → Job seekers see: "12 new jobs added matching your profile!"

---

GET /job-seekers/me/matched-jobs
Query: page, limit, minScore, source=all|direct|scraped

## Response: Combined (DirectJobMatch[] + ScrapedJobMatch[])

// Get matched candidates for my job (reverse matching)
GET /companies/me/jobs/:jobId/matched-candidates
Query: page, limit, minScore, availabilityStatus

Response: DirectJobMatch[] (candidates ranked by score)
