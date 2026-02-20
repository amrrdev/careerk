# Job Platform API Documentation

**Base URL:** `https://api.jobplatform.com/api/v1`

**Version:** 3.0

---

## 📚 Table of Contents

1. [Authentication](#authentication)
2. [Job Seeker Endpoints](#job-seeker-endpoints)
   - [Profile Management](#profile-management)
   - [CV Upload](#cv-upload)
   - [CV Parse](#cv-parse)
   - [Work Experience](#work-experience)
   - [Education](#education)
   - [Skills](#skills)
   - [Job Applications](#job-applications)
   - [Job Matching & Recommendations](#job-matching--recommendations)
   - [GitHub Projects & Open Source](#github-projects--open-source)
   - [Career Analytics](#career-analytics)
3. [Company/Employer Endpoints](#companyemployer-endpoints)
4. [Jobs (Public)](#jobs-public)
5. [Search & Discovery](#search--discovery)
6. [Interview Preparation](#interview-preparation)

---

## 🔐 Authentication

All authentication endpoints are **public** and do not require authentication.

### Register

```http
POST /auth/register/job-seeker
```

**Description:** Register a new job seeker account. Returns user details and JWT token.

```http
POST /auth/register/company
```

**Description:** Register a new company/employer account. Returns company details and JWT token.

---

### Login

```http
POST /auth/login
```

**Description:** Authenticate with email and password. Returns JWT access and refresh tokens.

```http
POST /auth/login/google
```

**Description:** Authenticate using Google OAuth. Redirects to Google consent screen, then returns tokens.

```http
POST /auth/login/linkedin
```

**Description:** Authenticate using LinkedIn OAuth. Redirects to LinkedIn consent screen, then returns tokens.

---

### Session Management

```http
POST /auth/logout
```

**Description:** Invalidate current session and access token. Requires authentication.

```http
POST /auth/refresh-token
```

**Description:** Obtain a new access token using a valid refresh token.

---

### Password Management

```http
POST /auth/forgot-password
```

**Description:** Request a password reset email. Sends reset link to registered email address.

```http
POST /auth/reset-password
```

**Description:** Reset password using token received via email. Requires reset token and new password.

---

### Email Verification

```http
POST /auth/verify-email
```

**Description:** Verify email address using token sent during registration.

```http
POST /auth/resend-verification
```

**Description:** Resend email verification link to registered email address.

---

## 👤 Job Seeker Endpoints

All endpoints require authentication as a **Job Seeker** unless marked as public.

---

### Profile Management

```http
GET /job-seekers
```

**Access:** Public  
**Description:** Search and list all job seeker profiles. Supports filtering by skills, location, availability, etc. Returns limited profile information for privacy.

```http
GET /job-seekers/{seekerId}
```

**Access:** Public  
**Description:** View a specific job seeker's public profile. Shows work experience, education, skills, and portfolio links. Sensitive data (expected salary) may be hidden based on viewer permissions.

```http
GET /job-seekers/me
```

**Access:** Job Seeker Only  
**Description:** Retrieve your complete profile including all personal information, work experiences, education, skills, and preferences.

```http
PATCH /job-seekers/me
```

**Access:** Job Seeker Only  
**Description:** Update your profile information. Supports partial updates to basic info, summary, location, availability status, salary expectations, work preferences, and social links.

```http
DELETE /job-seekers/me
```

**Access:** Job Seeker Only  
**Description:** Permanently delete your account and all associated data (profile, applications, CV, etc.). This action cannot be undone.

```http
PUT /job-seekers/me/avatar
```

**Access:** Job Seeker Only  
**Description:** Upload or replace your profile picture. Accepts image files (JPEG, PNG). Returns updated profile image URL.

---

### CV Upload

**Note:** Each job seeker can have only ONE CV at a time. The upload process involves two steps: 1) Get presigned URL, 2) Confirm upload (triggers NLP parsing).

#### Request Upload URL

```http
POST /cv/presigned-url
```

**Access:** Job Seeker Only  
**Description:** Request a presigned URL for uploading a CV file (PDF).

**Request Body:**
```json
{
  "fileName": "resume.pdf",
  "mimeType": "application/pdf"
}
```

**Response:**
```json
{
  "uploadUrl": "https://storage.url...",
  "key": "cvs/jobseeker-uuid/resume.pdf"
}
```

#### Confirm Upload

```http
POST /cv/confirm
```

**Access:** Job Seeker Only  
**Description:** Confirm the upload and trigger NLP parsing to extract CV data. This endpoint verifies the file exists, saves metadata, and calls the NLP service.

**Request Body:**
```json
{
  "key": "cvs/jobseeker-uuid/resume.pdf",
  "fileName": "resume.pdf",
  "mimeType": "application/pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "parseResultId": "uuid",
    "data": {
      "personalInfo": {
        "firstName": "Amr",
        "lastName": "Ashraf Mubarak",
        "email": "amrrdev@gmail.com",
        "phone": "+20 120 456 2326",
        "location": "",
        "linkedinUrl": "linkedin.com/in/amramubarak",
        "githubUrl": "github.com/amrrdev",
        "portfolioUrl": null
      },
      "title": "Software Engineer",
      "summary": "Software Engineer with experience...",
      "education": [
        {
          "institutionName": "Benha University",
          "degreeType": "BACHELOR",
          "fieldOfStudy": "Computer Science",
          "startDate": "2022",
          "endDate": "2026",
          "isCurrent": false,
          "gpa": 3.6,
          "description": null
        }
      ],
      "workExperience": [
        {
          "companyName": "Tech Corp",
          "jobTitle": "Software Engineer",
          "location": "Remote",
          "startDate": "2025-05-01",
          "endDate": "2025-07-01",
          "isCurrent": false,
          "description": "Developed..."
        }
      ],
      "skills": [
        { "name": "typescript", "verified": true },
        { "name": "node.js", "verified": true }
      ],
      "profile": {
        "expectedSalary": null,
        "workPreference": "REMOTE",
        "yearsOfExperience": 0.3,
        "noticePeriod": null,
        "availabilityStatus": null
      }
    },
    "processingTime": 952
  },
  "message": "Success"
}
```

#### Get CV Info

```http
GET /cv/me
```

**Access:** Job Seeker Only  
**Description:** Retrieve your current CV details including file name, URL, size, type, and parsing status.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "jobSeekerId": "uuid",
    "fileName": "resume.pdf",
    "mimeType": "application/pdf",
    "key": "cvs/jobseeker-uuid/resume.pdf",
    "createdAt": "2026-02-20T14:00:00Z",
    "updatedAt": "2026-02-20T14:00:00Z"
  }
}
```

#### Get CV Download URL

```http
GET /cv/me/download-url
```

**Access:** Job Seeker Only  
**Description:** Get a temporary download URL for your CV file.

**Response:**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://storage.url...temp..."
  }
}
```

#### Delete CV

```http
DELETE /cv/me
```

**Access:** Job Seeker Only  
**Description:** Delete your current CV. This does not delete manually entered profile data.

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "CV deleted successfully"
}
```

---

### CV Parse

Endpoints for previewing parsed CV data and confirming to save to profile.

#### Preview Parsed Data

```http
GET /cv-parse/preview
```

**Access:** Job Seeker Only  
**Description:** Get the latest parsed CV data from the most recent upload. Returns status (PENDING, COMPLETED, FAILED, CONFIRMED) and parsed data if completed.

**Response (COMPLETED):**
```json
{
  "success": true,
  "data": {
    "status": "COMPLETED",
    "parseResultId": "uuid",
    "data": {
      "personalInfo": {
        "firstName": "Amr",
        "lastName": "Ashraf Mubarak",
        "email": "amrrdev@gmail.com",
        "phone": "+20 120 456 2326",
        "location": "",
        "linkedinUrl": "linkedin.com/in/amramubarak",
        "githubUrl": "github.com/amrrdev",
        "portfolioUrl": null
      },
      "title": "Software Engineer",
      "summary": "Software Engineer with experience...",
      "education": [
        {
          "institutionName": "Benha University",
          "degreeType": "BACHELOR",
          "fieldOfStudy": "Computer Science",
          "startDate": "2022",
          "endDate": "2026",
          "isCurrent": false,
          "gpa": 3.6,
          "description": null
        }
      ],
      "workExperience": [
        {
          "companyName": "Tech Corp",
          "jobTitle": "Software Engineer",
          "location": "Remote",
          "startDate": "2025-05-01",
          "endDate": "2025-07-01",
          "isCurrent": false,
          "description": "Developed..."
        }
      ],
      "skills": [
        { "name": "typescript", "verified": true },
        { "name": "node.js", "verified": true }
      ],
      "profile": {
        "expectedSalary": null,
        "workPreference": "REMOTE",
        "yearsOfExperience": 0.3,
        "noticePeriod": null,
        "availabilityStatus": null
      }
    }
  },
  "message": "Success"
}
```

**Response (PENDING):**
```json
{
  "success": true,
  "data": {
    "status": "PENDING",
    "message": "Your CV is being processed. Please wait..."
  }
}
```

**Response (CONFIRMED):**
```json
{
  "success": true,
  "data": {
    "status": "CONFIRMED",
    "message": "CV data has already been saved to your profile"
  }
}
```

#### Confirm and Save to Profile

```http
POST /cv-parse/confirm
```

**Access:** Job Seeker Only  
**Description:** Review the parsed data and confirm to save it to your profile. This creates/updates your JobSeekerProfile, Education, WorkExperience, and Skills records.

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "Amr",
    "lastName": "Ashraf Mubarak",
    "email": "amrrdev@gmail.com",
    "phone": "+20 120 456 2326",
    "location": "",
    "linkedinUrl": "linkedin.com/in/amramubarak",
    "githubUrl": "github.com/amrrdev",
    "portfolioUrl": null
  },
  "title": "Software Engineer",
  "summary": "Software Engineer with experience...",
  "education": [
    {
      "institutionName": "Benha University",
      "degreeType": "BACHELOR",
      "fieldOfStudy": "Computer Science",
      "startDate": "2022",
      "endDate": "2026",
      "isCurrent": false,
      "gpa": 3.6,
      "description": null
    }
  ],
  "workExperience": [
    {
      "companyName": "Tech Corp",
      "jobTitle": "Software Engineer",
      "location": "Remote",
      "startDate": "2025-05-01",
      "endDate": "2025-07-01",
      "isCurrent": false,
      "description": "Developed..."
    }
  ],
  "skills": [
    { "name": "typescript", "verified": true },
    { "name": "node.js", "verified": true }
  ],
  "profile": {
    "expectedSalary": null,
    "workPreference": "REMOTE",
    "yearsOfExperience": 0.3,
    "noticePeriod": null,
    "availabilityStatus": "NOT_LOOKING"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully from CV"
  },
  "message": "Success"
}
```

**Validation Errors (400):**
```json
{
  "success": false,
  "error": {
    "message": [
      "profile.workPreference must be one of the following values: ONSITE, REMOTE, HYBRID, ANY",
      "profile.yearsOfExperience must be a number conforming to the specified constraints",
      "profile.availabilityStatus must be one of the following values: OPEN_TO_WORK, NOT_LOOKING, PASSIVELY_LOOKING"
    ],
    "statusCode": 400
  }
}
```

---

### Work Experience

```http
GET /job-seekers/me/work-experiences
```

**Access:** Job Seeker Only  
**Description:** List all your work experience entries in reverse chronological order.

```http
POST /job-seekers/me/work-experiences
```

**Access:** Job Seeker Only  
**Description:** Add a new work experience entry. Requires company name, job title, start date, and optionally end date (if not current).

```http
GET /job-seekers/me/work-experiences/{expId}
```

**Access:** Job Seeker Only  
**Description:** Retrieve details of a specific work experience entry.

```http
PATCH /job-seekers/me/work-experiences/{expId}
```

**Access:** Job Seeker Only  
**Description:** Update a specific work experience entry. Supports partial updates.

```http
DELETE /job-seekers/me/work-experiences/{expId}
```

**Access:** Job Seeker Only  
**Description:** Remove a work experience entry from your profile.

---

### Education

```http
GET /job-seekers/me/education
```

**Access:** Job Seeker Only  
**Description:** List all your education entries in reverse chronological order.

```http
POST /job-seekers/me/education
```

**Access:** Job Seeker Only  
**Description:** Add a new education entry. Requires institution name, degree type, field of study, and start date.

```http
GET /job-seekers/me/education/{eduId}
```

**Access:** Job Seeker Only  
**Description:** Retrieve details of a specific education entry.

```http
PATCH /job-seekers/me/education/{eduId}
```

**Access:** Job Seeker Only  
**Description:** Update a specific education entry. Supports partial updates.

```http
DELETE /job-seekers/me/education/{eduId}
```

**Access:** Job Seeker Only  
**Description:** Remove an education entry from your profile.

---

### Skills

```http
GET /job-seekers/me/skills
```

**Access:** Job Seeker Only  
**Description:** List all skills associated with your profile, including verification status (verified from CV or manually added).

```http
POST /job-seekers/me/skills
```

**Access:** Job Seeker Only  
**Description:** Add skills to your profile. Accepts single skill ID or bulk array of skill IDs. Skills must exist in the platform's skills database.

```http
DELETE /job-seekers/me/skills/{skillId}
```

**Access:** Job Seeker Only  
**Description:** Remove a specific skill from your profile.

---

### Job Applications

```http
GET /job-seekers/me/applications
```

**Access:** Job Seeker Only  
**Description:** List all your job applications with current status. Supports filtering by status (submitted, under_review, shortlisted, rejected, etc.).

```http
POST /job-seekers/me/applications
```

**Access:** Job Seeker Only  
**Description:** Apply to a job posting. Requires direct job ID and optionally a CV ID. Creates application record with "submitted" status.

```http
GET /job-seekers/me/applications/{appId}
```

**Access:** Job Seeker Only  
**Description:** Get detailed information about a specific application including job details, application date, current status, and status history.

```http
DELETE /job-seekers/me/applications/{appId}
```

**Access:** Job Seeker Only  
**Description:** Withdraw your application from a job. Changes status to "withdrawn". Cannot be undone.

---

### Job Matching & Recommendations

```http
GET /job-seekers/me/matches
```

**Access:** Job Seeker Only  
**Description:** Get AI-powered job recommendations ranked by match score. Includes both direct (platform) jobs and scraped (external) jobs. Supports pagination and filtering by job type, location, and minimum match score.

```http
POST /job-seekers/me/matches/refresh
```

**Access:** Job Seeker Only  
**Description:** Trigger recalculation of job matches based on your updated profile. Use this after updating skills, experience, or preferences.

---

### GitHub Projects & Open Source

**Note:** These endpoints integrate with GitHub API and may require GitHub OAuth connection.

```http
GET /job-seekers/me/recommendations/projects
```

**Access:** Job Seeker Only  
**Description:** Get recommended open source GitHub projects based on your skills and interests. Helps you contribute to open source and build portfolio.

```http
GET /projects/{owner}/{repo}
```

**Access:** Public  
**Description:** Get details about a specific GitHub project including description, stars, forks, primary language, and recent activity.

```http
GET /projects/{owner}/{repo}/issues
```

**Access:** Public  
**Description:** Get list of "good first issues" for a specific GitHub project. Filtered for beginner-friendly contribution opportunities.

---

### Career Analytics

```http
GET /job-seekers/me/analytics/career
```

**Access:** Job Seeker Only  
**Description:** Get personalized career insights including skill gap analysis (missing/weak skills compared to target jobs), career path suggestions, and salary benchmarking.

---

## 🏢 Company/Employer Endpoints

All endpoints require authentication as a **Company** unless marked as public.

---

### Company Profile Management

```http
GET /companies
```

**Access:** Public  
**Description:** List all companies on the platform. Supports filtering by industry, company size, location, and verification status.

```http
GET /companies/{companyId}
```

**Access:** Public  
**Description:** View a specific company's public profile including description, industry, size, location, social links, benefits, and active job postings. Supports including jobs with `?include=jobs` query parameter.

```http
GET /companies/me
```

**Access:** Company Only  
**Description:** Retrieve your complete company profile including all private information, settings, and statistics.

```http
PATCH /companies/me
```

**Access:** Company Only  
**Description:** Update your company profile information. Supports partial updates to name, description, industry, size, location, website, social links, and benefits.

```http
PATCH /companies/me/password
```

**Access:** Company Only  
**Description:** Change your account password. Requires current password verification for security.

```http
DELETE /companies/me
```

**Access:** Company Only  
**Description:** Permanently delete your company account and all associated data (jobs, applications, etc.). This action cannot be undone.

```http
PUT /companies/me/avatar
```

**Access:** Company Only  
**Description:** Upload or replace your company avatar. Accepts image files (JPEG, PNG). Returns updated avatar URL.

---

### Job Posting Management

```http
GET /companies/me/jobs
```

**Access:** Company Only  
**Description:** List all your job postings. Supports filtering by status (draft, published, paused, closed, filled), employment type, work arrangement, and experience level.

```http
POST /companies/me/jobs
```

**Access:** Company Only  
**Description:** Create a new job posting. Requires title, description, employment type, work arrangement, experience level, and skill IDs. New jobs start in "draft" status.

```http
GET /companies/me/jobs/{jobId}
```

**Access:** Company Only  
**Description:** Retrieve full details of a specific job posting including all fields, associated skills, view counts, and application statistics.

```http
PATCH /companies/me/jobs/{jobId}
```

**Access:** Company Only  
**Description:** Update job posting details. Supports partial updates to any field including title, description, requirements, salary range, deadline, and skills.

```http
DELETE /companies/me/jobs/{jobId}
```

**Access:** Company Only  
**Description:** Delete a job posting. This also removes all associated applications. Use "close" status instead if you want to keep application history.

---

### Job Status Management

```http
POST /companies/me/jobs/{jobId}/publish
```

**Access:** Company Only  
**Description:** Publish a draft job posting, making it visible to job seekers. Sets status to "published" and records publish timestamp.

```http
POST /companies/me/jobs/{jobId}/pause
```

**Access:** Company Only  
**Description:** Temporarily pause a published job posting. Job becomes hidden from search but retains all applications. Status changes to "paused".

```http
POST /companies/me/jobs/{jobId}/close
```

**Access:** Company Only  
**Description:** Close a job posting (no longer accepting applications). Job becomes hidden but all application data is retained. Status changes to "closed".

---

### Application Management

**Note:** Applications are automatically pre-ranked using match scores calculated when the job was published. No re-matching occurs on application - we use existing match data for instant ranking.

**Recommended Approach:** Flat structure with filtering

```http
GET /companies/me/applications
```

**Access:** Company Only  
**Description:** List all applications across all your job postings ranked by match score. Applications inherit match scores from the automatic candidate matching system (no re-calculation needed). Supports filtering by job ID, application status, date range, minimum match score, and candidate skills. Returns applications with basic candidate information and match score.

```http
GET /companies/me/applications/{appId}
```

**Access:** Company Only  
**Description:** Get detailed information about a specific application including full candidate profile snapshot, pre-calculated match score breakdown, application date, current status, and status history. Match score shows how well candidate fits the job requirements.

```http
PATCH /companies/me/applications/{appId}
```

**Access:** Company Only  
**Description:** Update application status (e.g., move to shortlisted, rejected, interview_scheduled, hired). Optionally include notes or feedback.

```http
GET /companies/me/applications/{appId}/cv
```

**Access:** Company Only  
**Description:** Download or get presigned URL for applicant's CV file. Returns file URL with temporary access token.

---

**Alternative Approach:** Nested under jobs (for job-centric workflows)

```http
GET /companies/me/jobs/{jobId}/applications
```

**Access:** Company Only  
**Description:** List all applications for a specific job posting ranked by match score. Applications are automatically ranked using pre-calculated match scores from when job was published. Same filtering options as flat structure.

```http
GET /companies/me/jobs/{jobId}/applications/{appId}
```

**Access:** Company Only  
**Description:** Get application details with match score breakdown scoped to specific job.

```http
PATCH /companies/me/jobs/{jobId}/applications/{appId}
```

**Access:** Company Only  
**Description:** Update application status scoped to specific job.

```http
GET /companies/me/jobs/{jobId}/applications/{appId}/cv
```

**Access:** Company Only  
**Description:** Download applicant's CV scoped to specific job.

---

### Candidate Matching & Recommendations

**Note:** When you publish a job, the system automatically matches ALL qualified candidates (those meeting minimum experience requirements). Candidates are ranked by match score and ready for review immediately.

```http
GET /companies/me/jobs/{jobId}/matched-candidates
```

**Access:** Company Only  
**Description:** Get AI-ranked list of qualified candidates who match this job posting. Matching happens automatically when job is published. Only shows candidates meeting minimum experience threshold (e.g., if job requires 3 years, shows candidates with 1+ years). Results are ranked by match score considering skills overlap, experience level alignment, location preference, and availability. Supports pagination and filtering by minimum match score, specific skills, location, and availability status.

```http
GET /companies/me/jobs/{jobId}/matched-candidates/{seekerId}
```

**Access:** Company Only  
**Description:** Get detailed match breakdown for a specific candidate and job. Shows overall match score, skill match details (matched skills, missing skills, extra skills), experience match score, location compatibility, and salary range alignment. Includes candidate's full profile and explanation of match factors.

---

## 💼 Jobs (Public)

All job listing endpoints are **public** and do not require authentication.

---

### Job Listings

```http
GET /jobs
```

**Access:** Public  
**Description:** Search and list all available jobs (both platform-posted and scraped external jobs). Supports extensive filtering by type (direct/scraped), location, skills, employment type, work arrangement, experience level, salary range, and company. Includes pagination.

```http
GET /jobs/direct/{jobId}
```

**Access:** Public  
**Description:** Get full details of a platform-posted job including company information, requirements, responsibilities, skills needed, salary range, and application instructions.

```http
GET /jobs/scraped/{jobId}
```

**Access:** Public  
**Description:** Get full details of an externally scraped job including source URL, extracted information, skills detected, and application link to original source.

```http
POST /jobs/direct/{jobId}/view
```

**Access:** Public (tracked if authenticated)  
**Description:** Track job view analytics. Increments view counter and creates view record with viewer information (if authenticated) and timestamp.

---

## 📊 Market Analytics

All analytics endpoints are **public** and provide aggregated market insights.

---

### Market Overview

```http
GET /analytics/market
```

**Access:** Public  
**Description:** Get comprehensive market overview dashboard including total active jobs, top hiring companies, most in-demand skills, average salaries by role, and hiring trends over time.

---

### Skills Analytics

```http
GET /analytics/market/skills/demand
```

**Access:** Public  
**Description:** Get list of most in-demand skills ranked by frequency in job postings. Shows percentage growth/decline compared to previous period.

```http
GET /analytics/market/skills/{skillId}
```

**Access:** Public  
**Description:** Get detailed trends for a specific skill including demand over time (6-12 month historical data), associated job titles, average salary for jobs requiring this skill, and related skills.

---

## 🔍 Search & Discovery

Unified search endpoint supporting multiple entity types.

---

```http
GET /search
```

**Access:** Public  
**Description:** Unified global search across jobs, companies, candidates (if company), and skills. Supports query parameter `q` for search term and `type` parameter to filter results (jobs, companies, candidates, all). Returns ranked results with relevance scores.

**Query Parameters:**

- `q` (required): Search query string
- `type` (optional): Filter by entity type (jobs, companies, candidates, all)
- `limit` (optional): Number of results per type (default: 10)
- Additional filters based on entity type (location, skills, etc.)

**Example:**

```
GET /search?q=frontend+developer&type=jobs&location=cairo
```

---

## 🎓 Interview Preparation

Public resources to help candidates prepare for interviews.

---

### Interview Questions

```http
GET /interview-prep/questions
```

**Access:** Public  
**Description:** Get curated list of interview questions. Supports filtering by difficulty, category (technical, behavioral, situational), and skills.

```http
GET /interview-prep/questions/{questionId}
```

**Access:** Public  
**Description:** Get detailed information about a specific interview question including the question text, sample answers, evaluation criteria, and related topics.

```http
GET /interview-prep/questions/by-skill/{skillId}
```

**Access:** Public  
**Description:** Get interview questions specifically related to a skill. Useful for targeted interview preparation.

```http
GET /interview-prep/questions/categories
```

**Access:** Public  
**Description:** List all question categories and their question counts. Helps users browse questions by topic (e.g., Data Structures, System Design, Leadership, etc.).

---

## 📝 Common Response Patterns

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## 🔑 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

Tokens expire after 24 hours. Use the refresh token endpoint to obtain a new access token without re-authenticating.

---

## 📌 Rate Limiting

- **Anonymous requests:** 100 requests/hour per IP
- **Authenticated requests:** 1000 requests/hour per user
- **Search endpoints:** 50 requests/hour per user

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1640000000
```

---

## 🌐 Supported Query Parameters

Most `GET` endpoints support common query parameters:

- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20, max: 100)
- `sort`: Sort field (e.g., `created_at`, `match_score`)
- `order`: Sort order (`asc` or `desc`)
- `fields`: Comma-separated list of fields to return (sparse fieldsets)

---

**Last Updated:** November 30, 2025
**API Version:** 3.0
