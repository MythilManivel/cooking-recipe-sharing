// src/pages/Dashboard.jsx
import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // You can add token clearing or auth logic here if needed
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleBrowseRecipes = () => {
    navigate('/recipes');
  };

  const handleShareRecipe = () => {
    navigate('/share');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1950&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: 10,
              p: 4
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} textAlign="center">
                <RestaurantIcon sx={{ fontSize: 70, color: '#ff7043', mb: 2 }} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Welcome, Foodie!
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Dive into a world of delicious recipes and share your culinary magic!
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 3,
                    backgroundColor: '#fff3e0',
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#ffe0b2'
                    }
                  }}
                  onClick={handleBrowseRecipes}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Browse Recipes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Discover, search, and save your favorites.
                    </Typography>
                  </Box>
                  <FastfoodIcon sx={{ fontSize: 40, color: '#ef6c00' }} />
                </Card>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 3,
                    backgroundColor: '#f3e5f5',
                    borderRadius: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#e1bee7'
                    }
                  }}
                  onClick={handleShareRecipe}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Share Your Recipe
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upload and showcase your signature dishes.
                    </Typography>
                  </Box>
                  <EmojiFoodBeverageIcon sx={{ fontSize: 40, color: '#6a1b9a' }} />
                </Card>
              </Grid>

              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<LogoutIcon />}
                  sx={{ mt: 4, px: 5, py: 1.5, fontWeight: 'bold' }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Grid>
            </Grid>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard;
