import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Pagination,
  InputAdornment
} from '@mui/material';
import {
  Launch,
  GitHub,
  Search,
  FilterList,
  CalendarToday,
  Code
} from '@mui/icons-material';
import { projectsAPI } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Projects = () => {
  const [page, setPage] = useState(1);
  const [skillFilter, setSkillFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const limit = 6;

  const { data: projectsData, isLoading, error } = useQuery(
    ['projects', { skill: skillFilter, page, limit }],
    () => projectsAPI.getProjects({ skill: skillFilter, page, limit }),
    {
      select: (response) => response.data,
      keepPreviousData: true,
    }
  );

  const filteredProjects = projectsData?.data?.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'planned': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading projects..." />;
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to load projects
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error.response?.data?.message || 'Something went wrong'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Projects
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore my portfolio of projects and technical achievements
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search projects..."
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by skill"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="e.g., react, node.js, python"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setSkillFilter('');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Projects Grid */}
      <Grid container spacing={3} mb={4}>
        {filteredProjects.map((project, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              className="hover-lift" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedProject(project)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {project.title}
                  </Typography>
                  <Chip
                    label={project.status || 'completed'}
                    size="small"
                    color={getStatusColor(project.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

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

                {(project.startDate || project.endDate) && (
                  <Box display="flex" alignItems="center" mb={2} color="text.secondary">
                    <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="caption">
                      {project.startDate && formatDate(project.startDate)}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && formatDate(project.endDate)}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" flexWrap="wrap" gap={0.5} mb={2}>
                  {project.skills?.slice(0, 4).map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                  {project.skills?.length > 4 && (
                    <Chip
                      label={`+${project.skills.length - 4} more`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Box display="flex" gap={1} width="100%">
                  {project.links?.map((link, linkIndex) => (
                    <IconButton
                      key={linkIndex}
                      size="small"
                      href={link}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      sx={{ 
                        bgcolor: 'grey.100',
                        '&:hover': { bgcolor: 'grey.200' }
                      }}
                    >
                      {link.includes('github') ? <GitHub /> : <Launch />}
                    </IconButton>
                  ))}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Code />}
                    sx={{ ml: 'auto' }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {projectsData?.pagination && projectsData.pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={projectsData.pagination.pages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Project Detail Dialog */}
      <Dialog 
        open={!!selectedProject} 
        onClose={() => setSelectedProject(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">
                  {selectedProject.title}
                </Typography>
                <Chip
                  label={selectedProject.status || 'completed'}
                  color={getStatusColor(selectedProject.status)}
                  sx={{ textTransform: 'capitalize' }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
                {selectedProject.description}
              </Typography>

              {(selectedProject.startDate || selectedProject.endDate) && (
                <Box display="flex" alignItems="center" mb={3} color="text.secondary">
                  <CalendarToday sx={{ fontSize: 20, mr: 1 }} />
                  <Typography variant="body2">
                    <strong>Duration:</strong> {' '}
                    {selectedProject.startDate && formatDate(selectedProject.startDate)}
                    {selectedProject.startDate && selectedProject.endDate && ' - '}
                    {selectedProject.endDate && formatDate(selectedProject.endDate)}
                  </Typography>
                </Box>
              )}

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Technologies Used
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedProject.skills?.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>

              {selectedProject.links && selectedProject.links.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Project Links
                  </Typography>
                  <Box display="flex" gap={2}>
                    {selectedProject.links.map((link, index) => (
                      <Button
                        key={index}
                        variant="contained"
                        href={link}
                        target="_blank"
                        startIcon={link.includes('github') ? <GitHub /> : <Launch />}
                      >
                        {link.includes('github') ? 'GitHub' : 'Live Demo'}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Empty State */}
      {filteredProjects.length === 0 && !isLoading && (
        <Box textAlign="center" py={8}>
          <Code sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || skillFilter 
              ? 'Try adjusting your search criteria'
              : 'No projects available at the moment'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Projects;
