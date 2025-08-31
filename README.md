# Me-API Playground

A comprehensive MERN stack application that serves as a personal profile and portfolio showcase with advanced API features, authentication, and modern UI/UX.

##  Live Demo

- **Frontend**:
- **Backend API**: 
- **Health Check**: /api/health

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Sample Requests](#sample-requests)
- [Known Limitations](#known-limitations)
- [Contributing](#contributing)
- [Resume](#resume)

##  Features

### Core Requirements 
- **Profile Management**: Complete CRUD operations for personal profile
- **Query Endpoints**: Advanced filtering and search capabilities
- **Health Check**: Comprehensive system health monitoring
- **Database Integration**: MongoDB with proper schema design
- **Frontend Interface**: Modern React UI with Material-UI and Tailwind CSS
- **CORS Configuration**: Properly configured for cross-origin requests

### Advanced Features 
- **Authentication**: JWT-based auth for write operations
- **Rate Limiting**: Configurable rate limits for different endpoints
- **Pagination**: Efficient data pagination for large datasets
- **Comprehensive Logging**: Request/response logging with file storage
- **Input Validation**: Multi-layer validation with sanitization
- **Error Handling**: Graceful error handling with proper HTTP status codes
- **Testing Suite**: Complete test coverage for all API endpoints
- **Security**: XSS protection, MongoDB injection prevention, helmet security
- **Docker Support**: Full containerization with Docker Compose
- **CI/CD Ready**: Deployment configurations for multiple platforms

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Morgan** - HTTP request logger
- **Helmet** - Security middleware
- **Express Rate Limit** - Rate limiting

### Frontend
- **React 18** - UI library
- **Material-UI v5** - Component library
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### DevOps & Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **Nodemon** - Development server
- **Concurrently** - Run multiple commands


### Key Components

1. **Frontend (React)**
   - Modern responsive UI with Material-UI components
   - Tailwind CSS for custom styling
   - React Query for efficient data management
   - Context-based authentication state

2. **Backend (Express)**
   - RESTful API with proper HTTP methods
   - JWT authentication middleware
   - Rate limiting and security middleware
   - Comprehensive error handling

3. **Database (MongoDB)**
   - Flexible document-based storage
   - Indexed collections for performance
   - Validation at database level

##  API Documentation

### Base URL
```
Local: http://localhost:5000/api
Production: https://me-api-playground-git-master-raunaks-projects-7384bbd6.vercel.app/api
```

### Authentication
Most write operations require JWT authentication:
```
Authorization: Bearer <your-jwt-token>
```

##  Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/raunak-111/me-api-playground.git
cd me-api-playground
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
npm run install-server

# Install client dependencies
npm run install-client
```

3. **Environment Setup**
```bash
# Copy environment file
cp server/.env.example server/.env

# Edit the .env file with your configuration
```

4. **Database Setup**
```bash
# Start MongoDB (if not using Docker)
mongod

# Seed the database with sample data
cd server && npm run seed
```

5. **Start Development Servers**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run server  # Backend only
npm run client  # Frontend only
```

### Docker Setup

1. **Using Docker Compose**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

2. **Individual Docker Build**
```bash
# Build the application
docker build -t me-api-playground .

# Run the container
docker run -p 5000:5000 --env-file server/.env me-api-playground
```

##  Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/me-api-playground
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🗄 Database Schema

### Collections

#### profiles
```javascript
{
  name: String (required),
  email: String (required, unique),
  title: String,
  bio: String,
  location: String,
  phone: String,
  education: [EducationSchema],
  skills: [SkillSchema],
  projects: [ProjectSchema],
  work: [WorkSchema],
  links: LinksSchema,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### users
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user']),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `profiles.email` (unique)
- `profiles.skills.name`
- `profiles.projects.skills`
- `users.email` (unique)
- `users.username` (unique)

##  Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:ci

# Run server tests only
cd server && npm test
```

### Test Coverage
- Authentication endpoints
- Profile CRUD operations
- Query and search functionality
- Error handling scenarios
- Rate limiting behavior

##  Deployment

### Vercel (frontend)
### Render (backend)




### Docker Deployment
```bash
# Production deployment with Docker
docker-compose -f docker-compose.prod.yml up -d
```

##  API Endpoints

### Health Check
- `GET /api/health` - System health status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Profile Management
- `GET /api/profile` - Get profile
- `POST /api/profile` - Create profile (protected)
- `PUT /api/profile` - Update profile (protected)
- `DELETE /api/profile` - Delete profile (protected)

### Query Endpoints
- `GET /api/profile/projects` - Get projects with optional filtering
- `GET /api/profile/projects?skill=react` - Filter projects by skill
- `GET /api/profile/skills/top` - Get top skills
- `GET /api/profile/skills?category=frontend` - Get skills by category
- `GET /api/profile/search?q=javascript` - Search across profile data

## Sample Requests

### Get Profile
```bash
curl -X GET http://localhost:5000/api/profile
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Search Profile
```bash
curl -X GET "http://localhost:5000/api/profile/search?q=react"
```

### Filter Projects by Skill
```bash
curl -X GET "http://localhost:5000/api/profile/projects?skill=javascript&page=1&limit=5"
```

### Update Profile (Protected)
```bash
curl -X PUT http://localhost:5000/api/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Updated Name","title":"Senior Developer"}'
```

##  Known Limitations

1. **Single Profile**: Currently supports only one active profile per instance
2. **File Uploads**: No file upload functionality for images/documents
3. **Email Notifications**: No email notification system implemented
4. **Real-time Updates**: No WebSocket support for real-time data updates
5. **Advanced Search**: Basic text search only, no fuzzy matching or advanced queries
6. **Caching**: No Redis caching layer for improved performance
7. **Monitoring**: No application performance monitoring (APM) integration

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 Resume

**[Download My Resume](https://drive.google.com/file/d/1zbu6soBd8rMe5HkkVpCxVcv-yg9zdAYK/view?usp=sharing)**

##  Contact

- **Email**: raunakprajapati111@gmail.com
- **LinkedIn**: [https://www.linkedin.com/in/raunak-prajapati/](https://www.linkedin.com/in/raunak-prajapati/)
- **GitHub**: [https://github.com/raunak-111](https://github.com/raunak-111)

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


