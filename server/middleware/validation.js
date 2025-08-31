const { body, query, param, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Profile validation rules
const validateProfile = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must not exceed 200 characters'),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio must not exceed 1000 characters'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location must not exceed 100 characters'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

// Project validation rules
const validateProject = [
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Project title must be between 2 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Project description must be between 10 and 2000 characters'),
  body('links').optional().isArray().withMessage('Links must be an array'),
  body('links.*').optional().isURL().withMessage('Each link must be a valid URL'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('skills.*').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Each skill must be between 1 and 50 characters'),
  handleValidationErrors
];

// Work experience validation rules
const validateWork = [
  body('company').trim().isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2 and 200 characters'),
  body('position').trim().isLength({ min: 2, max: 200 }).withMessage('Position must be between 2 and 200 characters'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description must not exceed 2000 characters'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('current').optional().isBoolean().withMessage('Current must be a boolean'),
  handleValidationErrors
];

// Education validation rules
const validateEducation = [
  body('institution').trim().isLength({ min: 2, max: 200 }).withMessage('Institution name must be between 2 and 200 characters'),
  body('degree').trim().isLength({ min: 2, max: 200 }).withMessage('Degree must be between 2 and 200 characters'),
  body('field').optional().trim().isLength({ max: 200 }).withMessage('Field must not exceed 200 characters'),
  body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
  body('gpa').optional().isFloat({ min: 0, max: 4 }).withMessage('GPA must be between 0 and 4'),
  handleValidationErrors
];

// Query validation rules
const validateQuery = [
  query('skill').optional().trim().isLength({ min: 1, max: 50 }).withMessage('Skill must be between 1 and 50 characters'),
  query('q').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Search query must be between 1 and 200 characters'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['frontend', 'backend', 'database', 'devops', 'mobile', 'other']).withMessage('Invalid category'),
  handleValidationErrors
];

// Auth validation rules for registration
const validateAuth = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Login validation rules (only email and password)
const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  validateProfile,
  validateProject,
  validateWork,
  validateEducation,
  validateQuery,
  validateAuth,
  validateLogin,
  handleValidationErrors
};
