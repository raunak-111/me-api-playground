import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore,
  Person,
  Work,
  Code,
  School,
  Launch,
  GitHub,
  Clear
} from '@mui/icons-material';
import { searchAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Search = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await searchAPI.search(query);
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
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

  const hasResults = searchResults && (
    searchResults.profile ||
    (searchResults.projects && searchResults.projects.length > 0) ||
    (searchResults.skills && searchResults.skills.length > 0) ||
    (searchResults.work && searchResults.work.length > 0) ||
    (searchResults.education && searchResults.education.length > 0)
  );

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Search Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search across projects, skills, work experience, and education
        </Typography>
      </Box>

      {/* Search Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search for skills, projects, companies, technologies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} size="small">
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSearch}
              disabled={!query.trim() || isSearching}
              sx={{ borderRadius: 2, py: 1.5 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
        
        {/* Quick Search Suggestions */}
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Try searching for:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {['React', 'Node.js', 'MongoDB', 'Full Stack', 'JavaScript', 'Python', 'AWS'].map((suggestion) => (
              <Chip
                key={suggestion}
                label={suggestion}
                variant="outlined"
                size="small"
                onClick={() => setQuery(suggestion)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'primary.light', color: 'white' } }}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Loading */}
      {isSearching && <LoadingSpinner message="Searching..." />}

      {/* Search Results */}
      {searchResults && !isSearching && (
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Search Results for "{searchResults.query}"
          </Typography>
          
          {!hasResults && (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No results found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try different keywords or check your spelling
              </Typography>
            </Paper>
          )}

          {/* Profile Results */}
          {searchResults.profile && (
            <Accordion defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Person sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Profile Match
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {searchResults.profile.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {searchResults.profile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchResults.profile.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchResults.profile.email}
                        </Typography>
                      </Box>
                    </Box>
                    {searchResults.profile.bio && (
                      <Typography variant="body2" paragraph>
                        {searchResults.profile.bio}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Projects Results */}
          {searchResults.projects && searchResults.projects.length > 0 && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Work sx={{ mr: 2, color: 'secondary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Projects ({searchResults.projects.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {searchResults.projects.map((project, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card className="hover-lift">
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {project.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {project.description}
                          </Typography>
                          
                          {project.skills && project.skills.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                              {project.skills.slice(0, 5).map((skill, skillIndex) => (
                                <Chip
                                  key={skillIndex}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                          
                          <Chip
                            label={project.status || 'completed'}
                            size="small"
                            color={project.status === 'completed' ? 'success' : 'primary'}
                          />
                          
                          {project.links && project.links.length > 0 && (
                            <Box mt={2}>
                              {project.links.map((link, linkIndex) => (
                                <IconButton
                                  key={linkIndex}
                                  href={link}
                                  target="_blank"
                                  size="small"
                                  sx={{ mr: 1 }}
                                >
                                  {link.includes('github') ? <GitHub /> : <Launch />}
                                </IconButton>
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Skills Results */}
          {searchResults.skills && searchResults.skills.length > 0 && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Code sx={{ mr: 2, color: 'success.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Skills ({searchResults.skills.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {searchResults.skills.map((skill, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Card>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="body1" fontWeight="medium" gutterBottom>
                            {skill.name}
                          </Typography>
                          <Chip
                            label={skill.level}
                            size="small"
                            color={getSkillColor(skill.level)}
                            sx={{ textTransform: 'capitalize' }}
                          />
                          <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                            {skill.category}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Work Experience Results */}
          {searchResults.work && searchResults.work.length > 0 && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <Work sx={{ mr: 2, color: 'warning.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Work Experience ({searchResults.work.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {searchResults.work.map((job, index) => (
                    <Grid item xs={12} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {job.position}
                          </Typography>
                          <Typography variant="body2" color="primary" gutterBottom>
                            {job.company}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                            {formatDate(job.startDate)} - {job.current ? 'Present' : formatDate(job.endDate)}
                          </Typography>
                          {job.description && (
                            <Typography variant="body2" paragraph>
                              {job.description}
                            </Typography>
                          )}
                          {job.skills && job.skills.length > 0 && (
                            <Box display="flex" flexWrap="wrap" gap={0.5}>
                              {job.skills.map((skill, skillIndex) => (
                                <Chip
                                  key={skillIndex}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Education Results */}
          {searchResults.education && searchResults.education.length > 0 && (
            <Accordion sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center">
                  <School sx={{ mr: 2, color: 'info.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Education ({searchResults.education.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {searchResults.education.map((edu, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </Typography>
                          <Typography variant="body2" color="secondary" gutterBottom>
                            {edu.institution}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {edu.startDate && formatDate(edu.startDate)} - {edu.endDate && formatDate(edu.endDate)}
                          </Typography>
                          {edu.gpa && (
                            <Typography variant="body2" mt={1}>
                              GPA: {edu.gpa}/4.0
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
