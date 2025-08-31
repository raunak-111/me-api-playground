import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Person,
  Work,
  Psychology,
  Search,
  Login,
  Logout,
  Code
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Profile', path: '/profile', icon: <Person /> },
    { label: 'Projects', path: '/projects', icon: <Work /> },
    { label: 'Skills', path: '/skills', icon: <Psychology /> },
    { label: 'Search', path: '/search', icon: <Search /> },
  ];

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                backgroundColor: isActivePath(item.path) ? 'primary.main' : 'transparent',
                color: isActivePath(item.path) ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: isActivePath(item.path) ? 'primary.dark' : 'grey.100',
                },
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: isActivePath(item.path) ? 'white' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          
          {!isAuthenticated ? (
            <ListItem
              button
              onClick={() => handleNavigation('/login')}
              sx={{
                backgroundColor: isActivePath('/login') ? 'primary.main' : 'transparent',
                color: isActivePath('/login') ? 'white' : 'inherit',
                '&:hover': {
                  backgroundColor: isActivePath('/login') ? 'primary.dark' : 'grey.100',
                },
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ color: isActivePath('/login') ? 'white' : 'inherit' }}>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          ) : (
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                mx: 1,
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" className="gradient-bg" elevation={0}>
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Code sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              sx={{ 
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => navigate('/')}
            >
              Me-API Playground
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    backgroundColor: isActivePath(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    borderRadius: 2,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {isAuthenticated ? (
                <>
                  <IconButton
                    onClick={handleMenuClick}
                    sx={{ ml: 1 }}
                  >
                    <Avatar
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: 'secondary.main',
                        fontSize: '0.875rem'
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleMenuClose}>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1, fontSize: 20 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  startIcon={<Login />}
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                    ml: 1,
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      {isMobile && <MobileDrawer />}
    </>
  );
};

export default Navbar;
