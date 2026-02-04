# CareerK API Documentation Summary

## Overview

This document provides a comprehensive summary of all authentication API endpoints that have been documented for the CareerK project. All documentation follows Mintlify standards and includes TypeScript and Python code examples only.

---

## 📚 Documented Endpoints

### 1. **Register Job Seeker**
- **Endpoint**: `POST /auth/register/job-seeker`
- **File**: `docs/api-reference/auth/register-job-seeker.mdx`
- **Purpose**: Create a new job seeker account
- **Authentication**: Public (no auth required)

#### Request Body
```typescript
{
  email: string;        // Must be unique, valid email format
  password: string;     // Minimum 6 characters
  firstName: string;    // User's first name
  lastName: string;     // User's last name
}
```

#### Response (200 OK)
```typescript
{
  success: boolean;
  data: {
    email: string;
  };
  message: string;  // "Job seeker registered successfully. Please check your email for verification code."
}
```

#### Key Features
- Validates email uniqueness across both job seekers and companies
- Sends 6-digit OTP to email (valid for 10 minutes)
- Password is hashed using bcrypt before storage
- User account starts as unverified (`isVerified: false`)

---

### 2. **Register Company**
- **Endpoint**: `POST /auth/register/company`
- **File**: `docs/api-reference/auth/register-company.mdx`
- **Purpose**: Create a new company account
- **Authentication**: Public (no auth required)

#### Request Body
```typescript
{
  email: string;        // Must be unique, valid email format
  password: string;     // Minimum 6 characters
  name: string;         // Company name
  industry: string;     // Company industry
  size: CompanySize;    // SIZE_1_50 | SIZE_51_200 | SIZE_201_1000 | SIZE_1000_PLUS
  type: CompanyType;    // STARTUP | SCALE_UP | ENTERPRISE | NON_PROFIT | GOVERNMENT
}
```

#### Response (200 OK)
```typescript
{
  success: boolean;
  data: {
    email: string;
  };
  message: string;  // "Company registered successfully. Please check your email for verification code."
}
```

#### Key Features
- Validates email uniqueness across both job seekers and companies
- Sends 6-digit OTP to email (valid for 10 minutes)
- Supports enum validation for `size` and `type` fields
- Password is hashed using bcrypt before storage

---

### 3. **Verify Email**
- **Endpoint**: `POST /auth/verify-email`
- **File**: `docs/api-reference/auth/verify-email.mdx`
- **Purpose**: Verify email address using OTP code sent during registration
- **Authentication**: Public (no auth required)

#### Request Body
```typescript
{
  email: string;    // Registered email address
  code: string;     // 6-digit OTP code from email
}
```

#### Response (200 OK) - Job Seeker
```typescript
{
  success: boolean;
  data: {
    id: string;
    email: string;
    password: string;              // Hashed (filter out!)
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    isActive: boolean;
    isVerified: boolean;           // Now true
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    accessToken: string;           // JWT access token (1 hour)
  };
  message: string;
}
```

#### Response (200 OK) - Company
```typescript
{
  success: boolean;
  data: {
    id: string;
    email: string;
    password: string;              // Hashed (filter out!)
    name: string;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    industry: string;
    size: string;
    type: string;
    headquartersLocation: string | null;
    foundedYear: number | null;
    websiteUrl: string | null;
    benefits: string | null;
    linkedIn: string | null;
    facebook: string | null;
    twitter: string | null;
    isActive: boolean;
    isVerified: boolean;           // Now true
    createdAt: string;
    updatedAt: string;
    accessToken: string;           // JWT access token (1 hour)
  };
  message: string;
}
```

#### Key Features
- OTP is single-use (deleted after verification)
- OTP expires after 10 minutes
- Sets `isVerified: true` on user account
- Generates access token (1 hour) and refresh token (24 hours)
- **Refresh token is set as HTTP-only cookie** (not in response body)
- Updates `lastLoginAt` timestamp for job seekers
- **Must use `credentials: 'include'` to receive refresh token cookie**

---

### 4. **Login**
- **Endpoint**: `POST /auth/login`
- **File**: `docs/api-reference/auth/login.mdx`
- **Purpose**: Authenticate existing users and receive tokens
- **Authentication**: Public (no auth required)

#### Request Body
```typescript
{
  email: string;        // Registered email (job seeker or company)
  password: string;     // User's password (minimum 6 characters)
}
```

#### Response (200 OK) - Job Seeker
```typescript
{
  success: boolean;
  data: {
    id: string;
    email: string;
    password: string;              // Hashed (filter out!)
    firstName: string;
    lastName: string;
    profileImageUrl: string | null;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
    accessToken: string;           // JWT access token (1 hour)
  };
  message: string;  // "Login successfully"
}
```

#### Response (200 OK) - Company
```typescript
{
  success: boolean;
  data: {
    id: string;
    email: string;
    password: string;              // Hashed (filter out!)
    name: string;
    description: string | null;
    logoUrl: string | null;
    coverUrl: string | null;
    industry: string;
    size: string;
    type: string;
    headquartersLocation: string | null;
    foundedYear: number | null;
    websiteUrl: string | null;
    benefits: string | null;
    linkedIn: string | null;
    facebook: string | null;
    twitter: string | null;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    accessToken: string;           // JWT access token (1 hour)
  };
  message: string;  // "Login successfully"
}
```

#### Key Features
- Automatically detects user type (job seeker or company) based on email
- Validates email is verified before allowing login
- Generates new access token (1 hour) and refresh token (24 hours)
- **Refresh token is set as HTTP-only cookie** (not in response body)
- Updates `lastLoginAt` timestamp for job seekers
- **Must use `credentials: 'include'` to receive refresh token cookie**

---

### 5. **Refresh Token**
- **Endpoint**: `POST /auth/refresh-token`
- **File**: `docs/api-reference/auth/refresh-token.mdx`
- **Purpose**: Get a new access token using refresh token
- **Authentication**: Requires valid refresh token cookie

#### Request Body
```typescript
// No body required - refresh token sent via HTTP-only cookie
```

#### Response (200 OK)
```typescript
{
  accessToken: string;  // New JWT access token (1 hour)
}
```

#### Key Features
- **No request body needed** - refresh token automatically sent via cookie
- **Must use `credentials: 'include'`** to send refresh token cookie
- **Token Rotation**: Old refresh token is invalidated, new one issued (security feature)
- New refresh token automatically set as HTTP-only cookie
- Access token valid for 1 hour, refresh token valid for 24 hours
- If refresh token expired/invalid, user must login again

---

## 🔐 Security Notes

### 1. **Password Hashing**
- All passwords are hashed using bcrypt before storage
- Original passwords are never stored or logged
- **Important**: Currently, the hashed password is returned in responses - filter it out in your frontend!

### 2. **Refresh Token Cookie**
- Refresh tokens are stored as **HTTP-only cookies**
- Cannot be accessed via JavaScript (XSS protection)
- Automatically sent with requests when using `credentials: 'include'`
- Cookie properties:
  - Name: `refreshToken`
  - HttpOnly: `true`
  - Secure: `true` (in production)
  - SameSite: `Strict`
  - Max-Age: 86400 seconds (24 hours)

### 3. **Token Rotation**
- Each token refresh invalidates the old refresh token
- New refresh token issued with each refresh
- Prevents refresh token reuse attacks
- If old token used again, it will fail

### 4. **OTP Security**
- OTP codes are 6 numeric digits
- Valid for 10 minutes only
- Single-use (deleted after successful verification)
- Stored in Redis with automatic expiration

### 5. **Email Verification**
- Users cannot login until email is verified
- Verification required after registration
- OTP sent via email (queued using BullMQ)

---

## 🎯 Common Error Responses

### 400 Bad Request - Validation Error
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized - Invalid Credentials
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - Email Not Verified
```json
{
  "statusCode": 401,
  "message": "Please verify your email before logging in",
  "error": "Unauthorized"
}
```

### 401 Unauthorized - Invalid OTP
```json
{
  "statusCode": 401,
  "message": "Invalid or expired OTP code",
  "error": "Unauthorized"
}
```

### 409 Conflict - Email Already Exists
```json
{
  "statusCode": 409,
  "message": "An account with this email already exists",
  "error": "Conflict"
}
```

---

## 💡 Best Practices for Frontend Implementation

### 1. **Always Use `credentials: 'include'`**
```typescript
const response = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',  // Required for cookie handling!
  body: JSON.stringify(data)
});
```

### 2. **Filter Out Password from Responses**
```typescript
const { accessToken, password, ...userData } = result.data;
// Never store or display the password field
localStorage.setItem('user', JSON.stringify(userData));
```

### 3. **Implement Automatic Token Refresh**
- Intercept 401 errors from protected endpoints
- Automatically call refresh token endpoint
- Retry original request with new access token
- See complete implementation examples in `refresh-token.mdx`

### 4. **Store Tokens Securely**
- **Access Token**: Store in memory or secure state management (avoid localStorage for sensitive apps)
- **Refresh Token**: Automatically handled via HTTP-only cookie (don't manually store)

### 5. **Handle Token Expiration**
- Access Token: 1 hour (refresh when expired)
- Refresh Token: 24 hours (require login when expired)
- Implement proactive refresh (5 minutes before expiration) for best UX

---

## 📋 JWT Token Structure

### Access Token Payload
```typescript
{
  sub: string;                        // User ID
  email: string;                      // User email
  type: 'JOB_SEEKER' | 'COMPANY';    // User type
  tokenType: 'ACCESS';                // Token type
  iat: number;                        // Issued at (Unix timestamp)
  exp: number;                        // Expires at (Unix timestamp)
  aud: string;                        // Audience (localhost:3000)
  iss: string;                        // Issuer (localhost:3000)
}
```

### Refresh Token Payload
```typescript
{
  sub: string;                        // User ID
  type: 'JOB_SEEKER' | 'COMPANY';    // User type
  tokenType: 'REFRESH';               // Token type
  refreshTokenId: string;             // Unique token ID (stored in Redis)
  iat: number;                        // Issued at (Unix timestamp)
  exp: number;                        // Expires at (Unix timestamp)
  aud: string;                        // Audience (localhost:3000)
  iss: string;                        // Issuer (localhost:3000)
}
```

---

## 🔄 Authentication Flow

### Registration Flow
```
1. User submits registration form
   ↓
2. POST /auth/register/job-seeker or /auth/register/company
   ↓
3. Server validates data and creates account (isVerified: false)
   ↓
4. Server generates 6-digit OTP and stores in Redis (10 min expiry)
   ↓
5. Server queues email with OTP to user
   ↓
6. Server returns success with email address
   ↓
7. User receives email with OTP code
   ↓
8. User submits email + OTP to verify-email endpoint
```

### Login Flow
```
1. User submits login form (email + password)
   ↓
2. POST /auth/login
   ↓
3. Server validates credentials and checks isVerified
   ↓
4. Server generates access token (1h) and refresh token (24h)
   ↓
5. Server stores refresh token ID in Redis
   ↓
6. Server sets refresh token as HTTP-only cookie
   ↓
7. Server returns user data + access token
   ↓
8. Frontend stores access token and user data
   ↓
9. Frontend makes authenticated requests with access token
```

### Token Refresh Flow
```
1. Access token expires or 401 error received
   ↓
2. POST /auth/refresh-token (refresh token sent via cookie)
   ↓
3. Server validates refresh token and checks Redis
   ↓
4. Server invalidates old refresh token in Redis
   ↓
5. Server generates new access token (1h) and refresh token (24h)
   ↓
6. Server stores new refresh token ID in Redis
   ↓
7. Server sets new refresh token as HTTP-only cookie
   ↓
8. Server returns new access token
   ↓
9. Frontend updates access token and retries original request
```

---

## 📊 Token Lifecycle

| Event | Access Token | Refresh Token |
|-------|-------------|---------------|
| Registration | Not issued | Not issued |
| Email Verification | New token (1h) | New token (24h) |
| Login | New token (1h) | New token (24h) |
| API Request | Sent in `Authorization: Bearer <token>` | Sent as cookie |
| Access Token Expires | Becomes invalid | Still valid |
| Refresh Token Used | New token (1h) | Old invalidated, new issued (24h) |
| Refresh Token Expires | Cannot refresh | User must login |
| Logout | Cleared from client | Invalidated in Redis |

---

## 🛠️ Complete TypeScript Example

```typescript
class AuthService {
  private baseUrl = 'http://localhost:3000';
  private accessToken: string | null = null;

  // Register Job Seeker
  async registerJobSeeker(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await fetch(`${this.baseUrl}/auth/register/job-seeker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Verify Email
  async verifyEmail(email: string, code: string) {
    const response = await fetch(`${this.baseUrl}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Important!
      body: JSON.stringify({ email, code })
    });
    const result = await response.json();
    this.accessToken = result.data.accessToken;
    return result;
  }

  // Login
  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // Important!
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    this.accessToken = result.data.accessToken;
    return result;
  }

  // Refresh Token
  async refreshAccessToken() {
    const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include',  // Important!
    });
    const result = await response.json();
    this.accessToken = result.accessToken;
    return result;
  }

  // Make authenticated request
  async authenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`,
        ...options.headers,
      },
      credentials: 'include',
    });

    // Auto-refresh on 401
    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.authenticatedRequest(endpoint, options);
    }

    return response;
  }
}
```

---

## 📝 Documentation Standards

All documentation follows these standards:

1. **Code Examples**: TypeScript and Python only
2. **Request/Response**: Exact match with backend code
3. **Field Documentation**: All fields documented with types and descriptions
4. **Error Handling**: Complete error response examples
5. **Security Notes**: Warnings and best practices highlighted
6. **Implementation Examples**: Real-world usage patterns
7. **Type Definitions**: Complete TypeScript interfaces provided

---

## 🚀 Next Steps

### Immediate Actions
1. ✅ All authentication endpoints documented
2. ✅ TypeScript and Python examples only
3. ✅ Request/response structures verified against backend code
4. ✅ Security notes and best practices included

### Recommended Backend Improvements
1. **Filter password from responses** - Remove hashed password field from all responses
2. **Add logout endpoint** - Invalidate refresh tokens on logout
3. **Add password reset flow** - Forgot password functionality
4. **Add email change flow** - Allow users to update email with verification

### Future Documentation Needs
1. **Job Seeker Module** - Profile, applications, saved jobs endpoints
2. **Company Module** - Profile, job postings, applications management
3. **Jobs Module** - CRUD operations for job postings
4. **Search/Filter** - Job search and filtering endpoints
5. **File Upload** - Profile images, company logos, resumes

---

## 📞 Support

For questions or issues with the documentation:
1. Check the individual endpoint docs in `docs/api-reference/auth/`
2. Review the code examples (TypeScript and Python)
3. Test against the running backend (`http://localhost:3000`)
4. Refer to backend source code in `src/modules/iam/authentication/`

---

**Last Updated**: February 4, 2025
**Backend Version**: 1.0.0
**Documentation Version**: 1.0.0