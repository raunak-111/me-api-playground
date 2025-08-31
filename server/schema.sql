-- MongoDB Schema Documentation
-- This file documents the MongoDB collections and their structure for the Me-API Playground

-- Collection: profiles
-- Description: Stores user profile information including personal details, skills, projects, work experience, and education
{
  "_id": "ObjectId",
  "name": "String (required, 2-100 chars)",
  "email": "String (required, unique, valid email)",
  "title": "String (optional, max 200 chars)",
  "bio": "String (optional, max 1000 chars)",
  "location": "String (optional, max 100 chars)",
  "phone": "String (optional, valid phone number)",
  
  "education": [
    {
      "institution": "String (required, 2-200 chars)",
      "degree": "String (required, 2-200 chars)",
      "field": "String (optional, max 200 chars)",
      "startDate": "Date (optional)",
      "endDate": "Date (optional)",
      "gpa": "Number (optional, 0-4)"
    }
  ],
  
  "skills": [
    {
      "name": "String (required, lowercase, 1-50 chars)",
      "level": "String (enum: 'beginner', 'intermediate', 'advanced', 'expert')",
      "category": "String (enum: 'frontend', 'backend', 'database', 'devops', 'mobile', 'other')"
    }
  ],
  
  "projects": [
    {
      "title": "String (required, 2-200 chars)",
      "description": "String (required, 10-2000 chars)",
      "links": ["String (valid URLs)"],
      "skills": ["String (1-50 chars each)"],
      "startDate": "Date (optional)",
      "endDate": "Date (optional)",
      "status": "String (enum: 'completed', 'in-progress', 'planned')"
    }
  ],
  
  "work": [
    {
      "company": "String (required, 2-200 chars)",
      "position": "String (required, 2-200 chars)",
      "description": "String (optional, max 2000 chars)",
      "startDate": "Date (required)",
      "endDate": "Date (optional)",
      "current": "Boolean (default: false)",
      "skills": ["String (skill names)"]
    }
  ],
  
  "links": {
    "github": "String (optional, valid URL)",
    "linkedin": "String (optional, valid URL)",
    "portfolio": "String (optional, valid URL)",
    "resume": "String (optional, valid URL)",
    "twitter": "String (optional, valid URL)"
  },
  
  "isActive": "Boolean (default: true)",
  "createdAt": "Date (auto-generated)",
  "updatedAt": "Date (auto-generated)"
}

-- Indexes for profiles collection:
-- { "email": 1 } - unique index for email lookup
-- { "skills.name": 1 } - index for skill-based queries
-- { "projects.skills": 1 } - index for project skill searches
-- { "work.skills": 1 } - index for work experience skill searches
-- { "isActive": 1 } - index for active profile filtering

-- Collection: users
-- Description: Stores authentication and user management data
{
  "_id": "ObjectId",
  "username": "String (required, unique, 3-30 chars)",
  "email": "String (required, unique, valid email, lowercase)",
  "password": "String (required, hashed, min 6 chars original)",
  "role": "String (enum: 'admin', 'user', default: 'user')",
  "isActive": "Boolean (default: true)",
  "createdAt": "Date (auto-generated)",
  "updatedAt": "Date (auto-generated)"
}

-- Indexes for users collection:
-- { "email": 1 } - unique index for email lookup
-- { "username": 1 } - unique index for username lookup
-- { "isActive": 1 } - index for active user filtering

-- Sample Data Structure:
-- See server/scripts/seedData.js for complete sample data

-- Security Considerations:
-- 1. Passwords are hashed using bcrypt with configurable rounds
-- 2. JWT tokens are used for authentication with configurable expiration
-- 3. Rate limiting is applied to prevent abuse
-- 4. Input validation is enforced at multiple levels
-- 5. MongoDB injection protection through sanitization
-- 6. XSS protection through input cleaning
