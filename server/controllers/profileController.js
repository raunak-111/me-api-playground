const Profile = require('../models/Profile');

// Get profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ isActive: true });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// Create profile
const createProfile = async (req, res) => {
  try {
    // Check if profile already exists
    const existingProfile = await Profile.findOne({ email: req.body.email });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Profile with this email already exists'
      });
    }

    const profile = new Profile(req.body);
    await profile.save();

    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating profile'
    });
  }
};

// Update profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { isActive: true },
      req.body,
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// Delete profile (soft delete)
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { isActive: true },
      { isActive: false },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting profile'
    });
  }
};

// Get projects with optional skill filter
const getProjects = async (req, res) => {
  try {
    const { skill, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const profile = await Profile.findOne({ isActive: true });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    let projects = profile.projects;

    // Filter by skill if provided
    if (skill) {
      projects = projects.filter(project => 
        project.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
      );
    }

    // Apply pagination
    const total = projects.length;
    const paginatedProjects = projects.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: paginatedProjects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects'
    });
  }
};

// Get top skills
const getTopSkills = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const profile = await Profile.findOne({ isActive: true });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const topSkills = profile.getTopSkills(parseInt(limit));

    res.json({
      success: true,
      data: topSkills
    });
  } catch (error) {
    console.error('Get top skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching top skills'
    });
  }
};

// Search functionality
const searchProfile = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const profile = await Profile.findOne({ isActive: true });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const searchTerm = q.toLowerCase();
    const results = {
      profile: null,
      projects: [],
      skills: [],
      work: [],
      education: []
    };

    // Search in profile basic info
    if (profile.name.toLowerCase().includes(searchTerm) ||
        profile.bio?.toLowerCase().includes(searchTerm) ||
        profile.title?.toLowerCase().includes(searchTerm)) {
      results.profile = {
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email
      };
    }

    // Search in projects
    results.projects = profile.projects.filter(project =>
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );

    // Search in skills
    results.skills = profile.skills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm) ||
      skill.category.toLowerCase().includes(searchTerm)
    );

    // Search in work experience
    results.work = profile.work.filter(work =>
      work.company.toLowerCase().includes(searchTerm) ||
      work.position.toLowerCase().includes(searchTerm) ||
      work.description?.toLowerCase().includes(searchTerm) ||
      work.skills.some(skill => skill.toLowerCase().includes(searchTerm))
    );

    // Search in education
    results.education = profile.education.filter(edu =>
      edu.institution.toLowerCase().includes(searchTerm) ||
      edu.degree.toLowerCase().includes(searchTerm) ||
      edu.field?.toLowerCase().includes(searchTerm)
    );

    res.json({
      success: true,
      data: results,
      query: q
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching'
    });
  }
};

// Get skills by category
const getSkillsByCategory = async (req, res) => {
  try {
    const { category } = req.query;
    
    const profile = await Profile.findOne({ isActive: true });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    let skills = profile.skills;
    
    if (category) {
      skills = profile.getSkillsByCategory(category);
    }

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      data: category ? skills : groupedSkills
    });
  } catch (error) {
    console.error('Get skills by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching skills'
    });
  }
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProjects,
  getTopSkills,
  searchProfile,
  getSkillsByCategory
};
