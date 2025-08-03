import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem('authRedirect', location.state?.from?.pathname || '/dashboard');
    window.location.href = `${process.env.REACT_APP_API_URL || ''}/api/auth/google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url("https://media-cldnry.s-nbcnews.com/image/upload/t_focal-758x379,f_auto,q_auto:best/rockcms/2022-03/plant-based-food-mc-220323-02-273c7b.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          zIndex: 0
        }}
      />

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 3
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Paper
              elevation={6}
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'white',
                backdropFilter: 'blur(16px)',
                borderRadius: 5,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 1
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Welcome Back! 👋
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Sign in to your Recipe App account
                  </Typography>
                </Box>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255, 0, 0, 0.2)' }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    margin="normal"
                    autoComplete="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: 'white' }} />
                        </InputAdornment>
                      )
                    }}
                    {...register('email', { required: 'Email is required' })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputLabelProps={{ style: { color: '#fff' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    autoComplete="current-password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: 'white' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    {...register('password', { required: 'Password is required' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputLabelProps={{ style: { color: '#fff' } }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                        backgroundColor: 'rgba(255,255,255,0.05)'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.2)'
                      }
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Link to="/forgot-password" style={{ color: '#90caf9', fontSize: '0.875rem' }}>
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.3,
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      borderRadius: 2
                    }}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>

                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }}>or</Divider>

                  <Button
                    fullWidth
                    onClick={handleGoogleLogin}
                    variant="outlined"
                    startIcon={<Google />}
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    Sign in with Google
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      Don't have an account?{' '}
                      <Link to="/signup" style={{ color: '#90caf9', fontWeight: 'bold' }}>
                        Signup
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          <Box sx={{ mt: 4, textAlign: 'center', zIndex: 1 }}>
            <Typography variant="body2" color="white">
              © 2024 Recipe App. Made with ❤️ for food lovers.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;