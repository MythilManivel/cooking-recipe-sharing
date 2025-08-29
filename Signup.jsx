import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Google
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register: registerUser, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data) => {
    if (!agreedToTerms) return;
    const { confirmPassword, ...userData } = data;
    const result = await registerUser(userData);
    if (result.success) navigate('/dashboard', { replace: true });
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem('authRedirect', '/dashboard');
    window.location.href = `${process.env.REACT_APP_API_URL || ''}/api/auth/google`;
  };

  const bgImage = "https://advisoranalyst.com/wp-content/uploads/2022/05/food-1200x675-1.jpeg";

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
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
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
          zIndex: 0
        }}
      />

      <Container component="main" maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
            
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(12px)',
              borderRadius: 4,
              boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h4" fontWeight="bold">
                Join Recipe App! 🍳
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Discover, create, and share your favorite dishes
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>{error}</Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  )
                }}
                {...register('name', { required: 'Full name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={textFieldStyle}
              />

              <TextField
                label="Email"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  )
                }}
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={textFieldStyle}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={textFieldStyle}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={textFieldStyle}
              />

              <FormControlLabel
                control={<Checkbox checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} sx={{ color: 'white' }} />}
                label={
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: '#FFE082' }}>Terms</Link> and{' '}
                    <Link to="/privacy" style={{ color: '#FFE082' }}>Privacy</Link>
                  </Typography>
                }
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting || !agreedToTerms}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    boxShadow: '0 6px 15px rgba(255, 105, 135, .4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }}>OR</Divider>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Continue with Google
              </Button>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: '#FFE082', fontWeight: 'bold' }}>Sign In</Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <Box sx={{ mt: 4, textAlign: 'center', color: 'white' }}>
          <Typography variant="body2">
            © 2024 Recipe App. Made with ❤️ for food lovers.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const textFieldStyle = {
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255,255,255,0.05)',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.3)'
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255,255,255,0.5)'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white'
    }
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.8)'
  },
  '& .MuiInputBase-input': {
    color: 'white'
  },
  mb: 2
};


export default Signup;
