import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Box, Button, TextField, Typography, InputAdornment, IconButton, Checkbox, FormControlLabel, useMediaQuery, useTheme } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const CommuterLogin = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberUsername, setRememberUsername] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check for saved username in localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberUsername(true);
    }
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const commuter = sessionStorage.getItem('commuter');
    if (commuter) {
      // User is already logged in, redirect to dashboard
      router.replace('/Commuterform');
    }
  }, [router]);

 // In your CommuterLogin component, modify the login success handler:

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage("");
  
  if (rememberUsername) {
    localStorage.setItem('rememberedUsername', username);
  } else {
    localStorage.removeItem('rememberedUsername');
  }
  
  try {
    const response = await axios.post(`${API_BASE_URL}/commuterlogin`, {
      username,
      password,
    });

    // After successful login
if (response.status === 200) {
  const commuter = response.data;
  if (!commuter.verified) {
    setErrorMessage("Your account is pending admin approval. Please wait for verification.");
    return;
  }
  
  // Store the commuter data in sessionStorage
  sessionStorage.setItem('commuter', JSON.stringify(commuter));
  
  // Replace (not push) the current history entry with the dashboard page
  // This will prevent going back to login when hitting back button
  router.replace('/Commuterform');
}
  } catch (error) {
    setErrorMessage(error.response?.data?.message || 'Invalid username or password');
  }
};

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundImage: 'url("/images/citystreet.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
      }}
      role="main"
      aria-label="Login page"
    >
      {/* Teal blue overlay with your specific styling */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 78, 115, 0.8)', // Teal blue with 80% opacity
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px' : '20px',
          boxSizing: 'border-box',
          overflowY: 'auto', // Allow vertical scrolling on small devices
          overflowX: 'hidden', // Prevent horizontal scrolling
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Header with City Logo */}
      <Box
        component="header"
        sx={{
          position: 'absolute',
          top: '10px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <Image src="/images/cityseal1.png" alt="City of Sorsogon Seal" width={isMobile ? 24 : 30} height={isMobile ? 24 : 30} />
        <Typography 
          variant={isMobile ? "subtitle1" : "h6"} 
          sx={{ 
            marginLeft: '10px', 
            fontWeight: 'bold', 
            color: 'white',
            fontSize: isMobile ? '0.8rem' : '1.10rem'
          }}
        >
          CITY OF SORSOGON
        </Typography>
      </Box>

      {/* Main Content - Centered */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          width: '100%',
          position: 'relative',
          zIndex: 2,
          padding: isMobile ? '16px' : '24px',
        }}
      >
        {/* Login Card */}
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: isMobile ? '20px' : '30px',
            width: '90%',
            maxWidth: '500px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          }}
          role="region"
          aria-label="Login form"
        >
          {/* Logo */}
          <Box sx={{ marginBottom: '20px' }}>
            <Image 
              src="/images/sklogo3.png" 
              alt="SK3 Logo" 
              width={isMobile ? 80 : 120} 
              height={isMobile ? 80 : 120} 
              priority
            />
          </Box>
          
          {/* Title */}
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              color: '#004d66', 
              fontWeight: 'bold', 
              marginBottom: '5px', 
              textAlign: 'center',
              fontSize: isMobile ? '1.5rem' : '2rem'
            }}
          >
            SK3 ONLINE REPORTING SYTEM
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#666', 
              marginBottom: '20px', 
              textAlign: 'center',
              fontSize: isMobile ? '0.875rem' : '1rem' 
            }}
          >
            A frontline government system for tricycle transport sector
          </Typography>

          {/* Login Form */}
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ width: '100%' }}
            noValidate
          >
            <TextField
              fullWidth
              placeholder="USERNAME"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              inputProps={{
                'aria-label': 'Username',
                'aria-required': 'true'
              }}
              sx={{ 
                marginBottom: '15px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#ccc' },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fas fa-user" style={{ color: '#666' }} aria-hidden="true"></i>
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="PASSWORD"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{
                'aria-label': 'Password',
                'aria-required': 'true'
              }}
              sx={{ marginBottom: '10px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="fas fa-lock" style={{ color: '#666' }} aria-hidden="true"></i>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowPassword(!showPassword)} 
                      edge="end"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            {errorMessage && (
              <Typography 
                color="error" 
                sx={{ marginBottom: '10px', textAlign: 'center' }}
                role="alert"
              >
                {errorMessage}
              </Typography>
            )}
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'row', // Always row direction
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '15px',
                width: '100%'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberUsername}
                    onChange={(e) => setRememberUsername(e.target.checked)}
                    size="small"
                    inputProps={{ 'aria-label': 'Remember username' }}
                  />
                }
                label={<Typography variant="body2">Remember Username</Typography>}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ 
                backgroundColor: '#1976D2', 
                color: 'white',
                padding: '10px',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#003d52',
                },
              }}
            >
              SIGN IN
            </Button>
          </Box>
        </Box>
        
        {/* Footer */}
        <Box 
          component="footer"
          sx={{ 
            position: 'absolute', 
            bottom: '20px', 
            right: '20px', 
            opacity: 0.8, 
            zIndex: 2 
          }}
        >
          <Typography variant="body2" sx={{ color: 'white' }}>
            © 2025 City of Sorsogon
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CommuterLogin;