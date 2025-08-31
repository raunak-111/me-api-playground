const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Profile = require('../models/Profile');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Profile.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();

    // Create Raunak's profile data
    const profileData = {
      name: 'Raunak Prajapati',
      email: 'raunakprajapati111@gmail.com',
      title: 'Full Stack Web Developer & Computer Science Student',
      bio: 'Passionate Computer Science Engineering student at IIIT Kalyani with hands-on experience in full-stack web development. Skilled in MERN stack, Python, and modern web technologies. Active contributor to projects and hackathon organizer.',
      location: 'Kishangarh-Ajmer District ,Rajasthan',
      phone: '+91 9929451516',
      education: [
        {
          institution: 'Indian Institute of Information Technology, Kalyani',
          degree: 'Bachelor of Technology',
          field: 'Computer Science and Engineering',
          startDate: new Date('2022-08-01'),
          endDate: null, // Currently pursuing
          gpa: 7.96
        }
      ],
      skills: [
        { name: 'c', level: 'advanced', category: 'backend' },
        { name: 'c++', level: 'advanced', category: 'backend' },
        { name: 'python', level: 'advanced', category: 'backend' },
        { name: 'javascript', level: 'expert', category: 'frontend' },
        { name: 'java', level: 'intermediate', category: 'backend' },
        { name: 'html', level: 'expert', category: 'frontend' },
        { name: 'css', level: 'expert', category: 'frontend' },
        { name: 'tailwind css', level: 'expert', category: 'frontend' },
        { name: 'react', level: 'expert', category: 'frontend' },
        { name: 'mongodb', level: 'advanced', category: 'database' },
        { name: 'sql', level: 'advanced', category: 'database' },
        { name: 'mysql', level: 'advanced', category: 'database' },
        { name: 'node.js', level: 'expert', category: 'backend' },
        { name: 'express.js', level: 'expert', category: 'backend' },
        { name: 'mongoose', level: 'advanced', category: 'database' },
        { name: 'django', level: 'advanced', category: 'backend' },
        { name: 'git', level: 'expert', category: 'other' },
        { name: 'github', level: 'expert', category: 'other' },
        { name: 'postman', level: 'advanced', category: 'other' },
        { name: 'canva', level: 'intermediate', category: 'other' },
        { name: 'figma', level: 'intermediate', category: 'other' },
        { name: 'balsamiq', level: 'intermediate', category: 'other' }
      ],
      projects: [
        {
          title: 'ChatSphere',
          description: 'Architected a real-time chat application with WebSockets for instant messaging and file sharing. Designed MongoDB schema for message history; implemented CRUD operations with Express.js. Integrated Cloudinary SDK in Node.js for media storage and retrieval. Achieved 99.9% uptime through optimized error handling and performance tuning.',
          links: ['https://github.com/raunak-111/Chat_application', 'https://chat-application-1-0eub.onrender.com/auth'],
          skills: ['vite.js', 'tailwind css', 'mongodb', 'node.js', 'express.js', 'cloudinary'],
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-04-01'),
          status: 'completed'
        },
        {
          title: 'SympCheck',
          description: 'Built a symptom-based disease-prediction web app with React front-end and Django REST back-end. Developed REST endpoints for user authentication and prediction logic; normalized MySQL database for symptom data. Enhanced UX with dynamic routing via Vite.js and responsive design using Tailwind CSS.',
          links: ['https://github.com/symptom-disease-mapping/disease-predictor'],
          skills: ['react.js', 'tailwind css', 'python', 'django', 'mysql'],
          startDate: new Date('2023-08-01'),
          endDate: new Date('2023-12-01'),
          status: 'completed'
        },
        {
          title: 'Status Code 1 (Hackathon Website)',
          description: 'Co-developed a responsive landing page for a 500+ participant hackathon; implemented modular components and accessibility features. Improved first-paint speed by 20% through code-splitting and lazy loading of assets.',
          links: ['https://github.com/raunak-111/Hackathon-website-StatusCode1-2024', 'https://iiitkalyanifosc.github.io/Hackathon-website-2024/'],
          skills: ['vite.js', 'javascript', 'tailwind css'],
          startDate: new Date('2023-10-01'),
          endDate: new Date('2023-11-01'),
          status: 'completed'
        },
        {
          title: 'Mega Mart E-commerce',
          description: 'Developed and maintained RESTful APIs using Node.js, Express.js, and MongoDB, supporting product catalog, user management, and order workflows. Integrated React.js front-end with backend endpoints to deliver dynamic, responsive UI components.',
          links: [''],
          skills: ['react.js', 'node.js', 'express.js', 'mongodb', 'cloudinary'],
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-03-01'),
          status: 'completed'
        },
        {
          title: 'Trip Booking Platform',
          description: 'Engineered a comprehensive trip booking platform enabling seamless travel planning, hotel reservations, and itinerary management. Developed RESTful APIs using Express.js for robust booking workflows and integrated MongoDB for scalable data storage. Implemented authentication and user management with JWT and bcrypt. Automated image uploads and retrieval via Cloudinary SDK. Ensured high reliability and performance through modular architecture, validation logic, and rigorous error handling.',
          links: ['https://github.com/raunak-111/trip_booking_platform','https://trip-booking-platform-c8cdt6a12-raunaks-projects-7384bbd6.vercel.app/'],
          skills: ['react.js', 'tailwind css', 'mongodb', 'node.js', 'express.js', 'cloudinary', 'jwt', 'bcrypt'],
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-08-01'),
          status: 'completed'
        }
      ],
      work: [
        {
          company: 'Aminurmus Technology Pvt Ltd',
          position: 'Full-stack Web Developer',
          description: 'Developed and maintained RESTful APIs using Node.js, Express.js, and MongoDB, supporting product catalog, user management, and order workflows. Integrated React.js front-end with backend endpoints to deliver dynamic, responsive UI components; improved page-load performance by 25%. Implemented Cloudinary for scalable image upload/storage, reducing image-asset load times by 30%. Established Git branching strategies and code-review practices; reduced merge conflicts by 40% and streamlined deployment workflows.',
          startDate: new Date('2024-09-01'),
          endDate: new Date('2025-03-01'),
          current: false,
          skills: ['react.js', 'node.js', 'express.js', 'mongodb', 'cloudinary', 'git']
        }
      ],
      links: {
        github: 'https://github.com/raunak-111',
        linkedin: 'https://linkedin.com/in/raunak-prajapati/',
        leetcode: 'https://leetcode.com/u/raunak111/',
        geeksforgeeks: 'https://geeksforgeeks.org/user/raunakpraj3t2i/',
        email: 'raunakprajapati111@gmail.com'
      }
    };

    // Create profile
    const profile = new Profile(profileData);
    await profile.save();

    console.log('✅ Seed data created successfully!');
    console.log(`✅ Admin user created: admin@example.com / admin123`);
    console.log(`✅ Profile created for: ${profile.name}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
