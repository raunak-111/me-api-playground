// MongoDB initialization script for Docker
db = db.getSiblingDB('me-api-playground');

// Create collections
db.createCollection('profiles');
db.createCollection('users');

// Create indexes for better performance
db.profiles.createIndex({ "email": 1 }, { unique: true });
db.profiles.createIndex({ "skills.name": 1 });
db.profiles.createIndex({ "projects.skills": 1 });
db.profiles.createIndex({ "work.skills": 1 });
db.profiles.createIndex({ "isActive": 1 });

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.users.createIndex({ "isActive": 1 });

print('Database initialized successfully!');
