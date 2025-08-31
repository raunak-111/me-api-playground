import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Code,
  Storage,
  Cloud,
  PhoneAndroid,
  Web,
  Settings,
  Search,
  TrendingUp
} from '@mui/icons-material';
import { skillsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Skills = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('level');

  const { data: skillsData, isLoading, error } = useQuery(
    'skills',
    skillsAPI.getAllSkills,
    {
      select: (response) => response.data.data,
    }
  );

  const { data: topSkillsData } = useQuery(
    'topSkills',
    () => skillsAPI.getTopSkills(20),
    {
      select: (response) => response.data.data,
    }
  );

  const categories = [
    { name: 'All Skills', value: 'all', icon: <Code /> },
    { name: 'Frontend', value: 'frontend', icon: <Web /> },
    { name: 'Backend', value: 'backend', icon: <Settings /> },
    { name: 'Database', value: 'database', icon: <Storage /> },
    // { name: 'DevOps', value: 'devops', icon: <Cloud /> },
    // { name: 'Mobile', value: 'mobile', icon: <PhoneAndroid /> },
    { name: 'Other', value: 'other', icon: <Code /> }
  ];

  const getSkillLevel = (level) => {
    const levels = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return levels[level] || 0;
  };

  const getSkillColor = (level) => {
    switch (level) {
      case 'expert': return 'error';
      case 'advanced': return 'warning';
      case 'intermediate': return 'info';
      case 'beginner': return 'success';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category) => {
    const categoryObj = categories.find(cat => cat.value === category);
    return categoryObj?.icon || <Code />;
  };

  const filterSkills = (skills, category) => {
    if (!skills) return [];
    
    let filtered = category === 'all' ? skills : skills[category] || [];
    
    if (Array.isArray(filtered)) {
      // If it's an array (from topSkills or filtered skills)
      if (searchTerm) {
        filtered = filtered.filter(skill => 
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Sort skills
      filtered.sort((a, b) => {
        if (sortBy === 'level') {
          const levelOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 };
          return levelOrder[b.level] - levelOrder[a.level];
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    }
    
    return filtered;
  };

  const getCurrentSkills = () => {
    const currentCategory = categories[activeTab];
    if (currentCategory.value === 'all') {
      // Flatten all skills from all categories
      const allSkills = [];
      if (skillsData && typeof skillsData === 'object') {
        Object.values(skillsData).forEach(categorySkills => {
          if (Array.isArray(categorySkills)) {
            allSkills.push(...categorySkills);
          }
        });
      }
      return filterSkills(allSkills, 'all');
    } else {
      return filterSkills(skillsData, currentCategory.value);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading skills..." />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load skills
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.response?.data?.message || 'Something went wrong'}
        </Typography>
      </Box>
    );
  }

  const currentSkills = getCurrentSkills();

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Skills & Expertise
        </Typography>
        <Typography variant="body1" color="text.secondary">
          My technical skills and proficiency levels across different domains
        </Typography>
      </Box>

      {/* Top Skills Overview */}
      {topSkillsData && (
        <Card sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box display="flex" alignItems="center" mb={3}>
            <TrendingUp sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              Top Skills
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {topSkillsData.slice(0, 8).map((skill, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {skill.name}
                  </Typography>
                  <Chip
                    label={skill.level}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {/* Filters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="level">Skill Level</MenuItem>
                <MenuItem value="name">Name (A-Z)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {Array.isArray(currentSkills) ? currentSkills.length : 0} skills found
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Category Tabs */}
      <Card sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((category, index) => (
            <Tab
              key={index}
              icon={category.icon}
              label={category.name}
              iconPosition="start"
              sx={{ minHeight: 64, textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Card>

      {/* Skills Grid */}
      <Grid container spacing={3}>
        {Array.isArray(currentSkills) && currentSkills.map((skill, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card className="hover-lift" sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {getCategoryIcon(skill.category)}
                  <Typography variant="h6" fontWeight="bold" sx={{ ml: 1, textTransform: 'capitalize' }}>
                    {skill.name}
                  </Typography>
                </Box>
                
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      Proficiency
                    </Typography>
                    <Chip
                      label={skill.level}
                      size="small"
                      color={getSkillColor(skill.level)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getSkillLevel(skill.level)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                    color={getSkillColor(skill.level)}
                  />
                </Box>
                
                <Chip
                  label={skill.category}
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'capitalize' }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {(!Array.isArray(currentSkills) || currentSkills.length === 0) && !isLoading && (
        <Box textAlign="center" py={8}>
          <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No skills found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : 'No skills available in this category'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Skills;
