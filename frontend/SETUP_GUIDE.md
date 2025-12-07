# LitigateIQ Setup Guide

## Backend Requirements

Your backend API must implement these endpoints:

### Authentication Endpoints
\`\`\`
POST /auth/signup
POST /auth/login
POST /auth/google
POST /auth/send-otp
POST /auth/verify-otp
\`\`\`

### Case Management Endpoints
\`\`\`
GET /cases
GET /cases/{id}
POST /cases
PUT /cases/{id}
DELETE /cases/{id}
GET /cases/{id}/participants
POST /cases/{id}/participants
DELETE /cases/{id}/participants/{userId}
GET /cases/{id}/documents
POST /cases/{id}/documents/upload
DELETE /cases/{id}/documents/{docId}
GET /cases/{id}/messages
POST /cases/{id}/messages
\`\`\`

### Hearings Endpoints
\`\`\`
GET /hearings
POST /hearings
PUT /hearings/{id}
DELETE /hearings/{id}
\`\`\`

### Organization Endpoints
\`\`\`
GET /organizations/{id}
PUT /organizations/{id}
POST /organizations/invite-member
GET /organizations/members
PUT /organizations/members/{id}
DELETE /organizations/members/{id}
\`\`\`

### Notifications
\`\`\`
GET /notifications
PUT /notifications/{id}/read
DELETE /notifications/{id}
\`\`\`

## Environment Setup

Create `.env.local`:
\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here

# Optional: Development redirect URL for Supabase
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## Running Locally

1. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Start development server**
\`\`\`bash
npm run dev
\`\`\`

3. **Open browser**
\`\`\`
http://localhost:3000
\`\`\`

## Initial Setup Steps

1. **Sign up** with email or Google
2. **Create organization** during setup
3. **Add team members** from organization settings
4. **Create first case** from cases page
5. **Schedule hearings** for case
6. **Invite team** to participate

## Testing Credentials

For development, create test users:
- Admin: admin@litigateiq.com
- Lawyer: lawyer@litigateiq.com
- Junior: junior@litigateiq.com

## Database Schema

Implement these collections/tables:

### Users
\`\`\`
- id (PK)
- email (unique)
- firstName
- lastName
- password (hashed)
- role (admin, lawyer, junior_lawyer)
- organizationId (FK)
- avatar
- phone
- createdAt
- updatedAt
\`\`\`

### Organizations
\`\`\`
- id (PK)
- name
- email
- phone
- address
- logo
- subscription
- createdAt
- updatedAt
\`\`\`

### Cases
\`\`\`
- id (PK)
- organizationId (FK)
- title
- caseNumber
- clientNames (array)
- description
- status
- priority
- assignedLawyers (array)
- assignedJuniors (array)
- nextHearingDate
- createdAt
- updatedAt
\`\`\`

### Hearings
\`\`\`
- id (PK)
- caseId (FK)
- date
- time
- location
- judge
- notes
- status
- createdAt
\`\`\`

### Messages
\`\`\`
- id (PK)
- caseId (FK)
- senderId (FK)
- message
- attachments (array)
- timestamp
\`\`\`

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up SSL certificate
- [ ] Configure database backups
- [ ] Set up error logging (Sentry)
- [ ] Configure email service
- [ ] Test all authentication flows
- [ ] Verify file uploads work
- [ ] Test real-time features
- [ ] Performance testing
- [ ] Security audit

## Performance Tips

- Use database indexes on frequently queried fields
- Implement pagination for large result sets
- Cache frequently accessed data
- Use CDN for static assets
- Enable gzip compression
- Implement rate limiting
- Monitor API response times
