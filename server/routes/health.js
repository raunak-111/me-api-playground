const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Basic system info
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'N/A'
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      },
      version: '1.0.0'
    };

    // If database is not connected, return 503
    if (dbStatus !== 'connected') {
      return res.status(503).json({
        success: false,
        message: 'Service unavailable - database not connected',
        data: healthData
      });
    }

    res.json({
      success: true,
      message: 'Service is healthy',
      data: healthData
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      error: error.message
    });
  }
});

module.exports = router;
