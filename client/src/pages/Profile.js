import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  GitHub,
  LinkedIn,
  Language,
  Email,
  LocationOn,
  Phone,
  Work,
  School,
  CalendarToday,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { profileAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  
  const { data: profileData, isLoading, error, refetch } = useQuery(
    'profile',
    profileAPI.getProfile,
    {
      select: (response) => response.data.data,
    }
  );

  const { control, handleSubmit, reset, formState: { errors } } = useForm();

  const handleEdit = () => {
    if (profileData) {
      reset(profileData);
      setEditDialog(true);
    }
  };

  const onSubmit = async (data) => {
    try {
      await profileAPI.updateProfile(data);
      toast.success('Profile updated successfully!');
      setEditDialog(false);
      refetch();
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

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
    <Box>
      {/* Profile Header */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mr: 3,
                bgcolor: 'primary.main',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}
            >
              {profile?.name?.charAt(0) || 'J'}
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {profile?.name || 'John Doe'}
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {profile?.title || 'Full Stack Developer'}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {profile?.location && (
                  <Chip icon={<LocationOn />} label={profile.location} variant="outlined" />
                )}
                {profile?.email && (
                  <Chip icon={<Email />} label={profile.email} variant="outlined" />
                )}
                {profile?.phone && (
                  <Chip icon={<Phone />} label={profile.phone} variant="outlined" />
                )}
              </Box>
            </Box>
          </Box>
          
          {isAuthenticated && (
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          {profile?.bio || 'No bio available'}
        </Typography>

        <Box display="flex" gap={1} mt={3}>
          {profile?.links?.github && (
            <IconButton
              href={profile.links.github}
              target="_blank"
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <GitHub />
            </IconButton>
          )}
          {profile?.links?.linkedin && (
            <IconButton
              href={profile.links.linkedin}
              target="_blank"
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <LinkedIn />
            </IconButton>
          )}
          {profile?.links?.portfolio && (
            <IconButton
              href={profile.links.portfolio}
              target="_blank"
              sx={{ bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
            >
              <Language />
            </IconButton>
          )}
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Skills Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Skills
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              {['frontend', 'backend', 'database', 'devops', 'mobile', 'other'].map((category) => {
                const categorySkills = profile?.skills?.filter(skill => skill.category === category) || [];
                if (categorySkills.length === 0) return null;
                
                return (
                  <Box key={category} mb={3}>
                    <Typography variant="h6" sx={{ textTransform: 'capitalize', mb: 1 }}>
                      {category}
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {categorySkills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={`${skill.name} (${skill.level})`}
                          color={
                            skill.level === 'expert' ? 'error' :
                            skill.level === 'advanced' ? 'warning' :
                            skill.level === 'intermediate' ? 'info' : 'default'
                          }
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Work Experience
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {profile?.work?.map((job, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <Work color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          {job.position}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="primary" gutterBottom>
                            {job.company}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" mb={1}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            {new Date(job.startDate).toLocaleDateString()} - {job.current ? 'Present' : new Date(job.endDate).toLocaleDateString()}
                          </Typography>
                          {job.description && (
                            <Typography variant="body2" paragraph>
                              {job.description}
                            </Typography>
                          )}
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {job.skills?.map((skill, skillIndex) => (
                              <Chip
                                key={skillIndex}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Education */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Education
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {profile?.education?.map((edu, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <School color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight="bold">
                          {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="secondary" gutterBottom>
                            {edu.institution}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" mb={1}>
                            <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                            {edu.startDate && new Date(edu.startDate).toLocaleDateString()} - {edu.endDate && new Date(edu.endDate).toLocaleDateString()}
                          </Typography>
                          {edu.gpa && (
                            <Typography variant="body2">
                              GPA: {edu.gpa}/10.0
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      type="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Title"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Bio"
                      multiline
                      rows={4}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Location"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Profile;
