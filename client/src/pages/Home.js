import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  IconButton,
  Paper,
  Container
} from '@mui/material';
import {
  Person,
  Work,
  School,
  Code,
  Launch,
  GitHub,
  LinkedIn,
  Language,
  Email,
  LocationOn,
  Phone
} from '@mui/icons-material';
import { profileAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorBoundary from '../components/Common/ErrorBoundary';

const Home = () => {
  const navigate = useNavigate();
  
  const { data: profileData, isLoading, error } = useQuery(
    'profile',
    profileAPI.getProfile,
    {
      select: (response) => response.data.data,
      staleTime: 5 * 60 * 1000,
    }
  );

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.response?.data?.message || 'Something went wrong'}
        </Typography>
      </Box>
    );
  }

  const profile = profileData;

  return (
    <ErrorBoundary>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Paper 
          className="gradient-bg hover-lift" 
          sx={{ 
            p: 6, 
            mb: 4, 
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mr: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {profile?.name?.charAt(0) || 'J'}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                      {profile?.name || 'John Doe'}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                      {profile?.title || 'Full Stack Developer'}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, lineHeight: 1.6 }}>
                  {profile?.bio || 'Passionate developer building amazing web applications'}
                </Typography>

                <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
                  {profile?.location && (
                    <Chip
                      icon={<LocationOn />}
                      label={profile.location}
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  )}
                  {profile?.email && (
                    <Chip
                      icon={<Email />}
                      label={profile.email}
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  )}
                  {profile?.phone && (
                    <Chip
                      icon={<Phone />}
                      label={profile.phone}
                      variant="outlined"
                      sx={{ 
                        color: 'white', 
                        borderColor: 'rgba(255,255,255,0.5)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  )}
                </Box>

                <Box display="flex" gap={1}>
                  {profile?.links?.github && (
                    <IconButton
                      href={profile.links.github}
                      target="_blank"
                      sx={{ 
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    >
                      <GitHub />
                    </IconButton>
                  )}
                  {profile?.links?.linkedin && (
                    <IconButton
                      href={profile.links.linkedin}
                      target="_blank"
                      sx={{ 
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                  )}
                  {profile?.links?.portfolio && (
                    <IconButton
                      href={profile.links.portfolio}
                      target="_blank"
                      sx={{ 
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                      }}
                    >
                      <Language />
                    </IconButton>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/profile')}
                    sx={{
                      bgcolor: 'white',
                      color: 'primary.main',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                    startIcon={<Person />}
                  >
                    View Full Profile
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/projects')}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { 
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                    startIcon={<Work />}
                  >
                    View Projects
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-lift" sx={{ textAlign: 'center', p: 3 }}>
              <Work sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                {profile?.projects?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Projects
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-lift" sx={{ textAlign: 'center', p: 3 }}>
              <Code sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {profile?.skills?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Skills
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-lift" sx={{ textAlign: 'center', p: 3 }}>
              <Work sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {profile?.work?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Work Experience
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card className="hover-lift" sx={{ textAlign: 'center', p: 3 }}>
              <School sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {profile?.education?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Education
              </Typography>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Projects */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">
              Featured Projects
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/projects')}
              endIcon={<Launch />}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {profile?.projects?.slice(0, 3).map((project, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="hover-lift" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      paragraph
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {project.description}
                    </Typography>
                    
                    <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                      {project.skills?.slice(0, 3).map((skill, skillIndex) => (
                        <Chip
                          key={skillIndex}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                      {project.skills?.length > 3 && (
                        <Chip
                          label={`+${project.skills.length - 3} more`}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                    
                    <Chip
                      label={project.status || 'completed'}
                      size="small"
                      color={project.status === 'completed' ? 'success' : 'primary'}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Skills */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight="bold">
              Top Skills
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/skills')}
              endIcon={<Launch />}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={2}>
            {profile?.skills?.slice(0, 12).map((skill, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card className="hover-lift" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {skill.name}
                  </Typography>
                  <Chip
                    label={skill.level}
                    size="small"
                    color={
                      skill.level === 'expert' ? 'error' :
                      skill.level === 'advanced' ? 'warning' :
                      skill.level === 'intermediate' ? 'info' : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ErrorBoundary>
  );
};

export default Home;
