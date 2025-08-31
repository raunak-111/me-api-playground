import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd,
  Code
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { control: loginControl, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm();
  const { control: registerControl, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm();

  const from = location.state?.from?.pathname || '/';

  const onLoginSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    const result = await login(data.email, data.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Login failed');
    }
    
    setLoading(false);
  };

  const onRegisterSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    
    const result = await register(data.username, data.email, data.password);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || 'Registration failed');
    }
    
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
              <Code sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
              <Typography variant="h4" fontWeight="bold" className="gradient-text">
                Me-API
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary">
              {activeTab === 0 ? 'Sign in to your account' : 'Create a new account'}
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              setError('');
            }}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab icon={<LoginIcon />} label="Login" iconPosition="start" />
            <Tab icon={<PersonAdd />} label="Register" iconPosition="start" />
          </Tabs>

          {/* Login Form */}
          {activeTab === 0 && (
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={loginControl}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!loginErrors.email}
                        helperText={loginErrors.email?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={loginControl}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!loginErrors.password}
                        helperText={loginErrors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      borderRadius: 2, 
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 1 && (
            <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="username"
                    control={registerControl}
                    rules={{
                      required: 'Username is required',
                      minLength: {
                        value: 3,
                        message: 'Username must be at least 3 characters'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Username"
                        error={!!registerErrors.username}
                        helperText={registerErrors.username?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="email"
                    control={registerControl}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        type="email"
                        error={!!registerErrors.email}
                        helperText={registerErrors.email?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="password"
                    control={registerControl}
                    rules={{
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!registerErrors.password}
                        helperText={registerErrors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Controller
                    name="confirmPassword"
                    control={registerControl}
                    rules={{
                      required: 'Please confirm your password'
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Confirm Password"
                        type={showPassword ? 'text' : 'password'}
                        error={!!registerErrors.confirmPassword}
                        helperText={registerErrors.confirmPassword?.message}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                      />
                    )}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ 
                      borderRadius: 2, 
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Demo Credentials */}
          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Demo credentials for testing:
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Email: admin@example.com | Password: admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
