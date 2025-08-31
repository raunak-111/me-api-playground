# Quick Setup Guide

## Prerequisites
- Node.js 18+ and npm
- MongoDB 7.0+ (or use Docker)
- Git

## 🚀 Quick Start (Recommended)

### Option 1: Using Docker (Easiest)
```bash
# Clone and start everything with Docker
git clone <your-repo-url>
cd me-api-playground
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Health Check: http://localhost:5000/api/health
```

### Option 2: Local Development
```bash
# 1. Install dependencies
npm install
npm run install-server
npm run install-client

# 2. Set up environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI

# 3. Start MongoDB (if not using Docker)
mongod

# 4. Seed the database
cd server && node scripts/seedData.js

# 5. Start the application
cd .. && npm run dev
```

## 🔧 Environment Setup

Create `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/me-api-playground
JWT_SECRET=me-api-playground-super-secret-jwt-key-2024
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 🧪 Testing the Application

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Get Profile
```bash
curl http://localhost:5000/api/profile
```

### 3. Login (Demo Credentials)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### 4. Search
```bash
curl "http://localhost:5000/api/profile/search?q=react"
```

## 📱 Frontend Features

- **Home Page**: Overview with stats and featured content
- **Profile Page**: Complete profile view with edit functionality
- **Projects Page**: Filterable and searchable project portfolio
- **Skills Page**: Categorized skills with proficiency levels
- **Search Page**: Global search across all profile data
- **Login Page**: Authentication with demo credentials

## 🔑 Demo Credentials

- **Email**: admin@example.com
- **Password**: admin123

## 🚨 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Conflicts
```bash
# Check what's running on ports
netstat -tulpn | grep :5000  # Backend
netstat -tulpn | grep :3000  # Frontend
```

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

## 📊 Production Deployment

### Heroku + Netlify
1. Deploy backend to Heroku
2. Deploy frontend to Netlify
3. Update CORS origins in server
4. Set environment variables

### Vercel (Full Stack)
1. Connect GitHub repo to Vercel
2. Configure environment variables
3. Deploy using vercel.json config

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🎯 Next Steps

1. Customize the profile data in `server/scripts/seedData.js`
2. Update the README with your actual URLs
3. Add your real resume link
4. Deploy to your preferred platform
5. Set up monitoring and analytics
