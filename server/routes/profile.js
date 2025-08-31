const express = require('express');
const router = express.Router();
const {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getProjects,
  getTopSkills,
  searchProfile,
  getSkillsByCategory
} = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const { writeLimiter } = require('../middleware/rateLimiter');
const {
  validateProfile,
  validateQuery
} = require('../middleware/validation');

// Public routes
router.get('/', getProfile);
router.get('/projects', getProjects);
router.get('/skills/top', validateQuery, getTopSkills);
router.get('/skills', validateQuery, getSkillsByCategory);
router.get('/search', validateQuery, searchProfile);

// Protected routes (require authentication)
router.post('/', [auth, writeLimiter, validateProfile], createProfile);
router.put('/', [auth, writeLimiter, validateProfile], updateProfile);
router.delete('/', [auth, writeLimiter], deleteProfile);

module.exports = router;
