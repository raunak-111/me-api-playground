const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  links: [{
    type: String,
    trim: true
  }],
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  }
});

const workSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  skills: [{
    type: String,
    trim: true,
    lowercase: true
  }]
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  field: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  gpa: {
    type: Number,
    min: 0,
    max: 10
  }
});

const linksSchema = new mongoose.Schema({
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  twitter: {
    type: String,
    trim: true
  }
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  title: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  education: [educationSchema],
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'other'],
      default: 'other'
    }
  }],
  projects: [projectSchema],
  work: [workSchema],
  links: linksSchema,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
profileSchema.index({ email: 1 });
profileSchema.index({ 'skills.name': 1 });
profileSchema.index({ 'projects.skills': 1 });
profileSchema.index({ 'work.skills': 1 });

// Virtual for full name display
profileSchema.virtual('displayName').get(function() {
  return this.name;
});

// Method to get skills by category
profileSchema.methods.getSkillsByCategory = function(category) {
  return this.skills.filter(skill => skill.category === category);
};

// Method to get top skills (by level)
profileSchema.methods.getTopSkills = function(limit = 10) {
  const skillLevels = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
  return this.skills
    .sort((a, b) => skillLevels[b.level] - skillLevels[a.level])
    .slice(0, limit);
};

module.exports = mongoose.model('Profile', profileSchema);
