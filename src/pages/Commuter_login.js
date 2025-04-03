import { useState } from 'react';
import Image from 'next/image';
import { TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const CommuterLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post(`${API_BASE_URL}/commuterlogin`, {
        username,
        password,
      });

      if (response.status === 200) {
        const commuter = response.data;
        if (!commuter.verified) {
          setErrorMessage("Your account is pending admin approval. Please wait for verification.");
          return;
        }
        sessionStorage.setItem('commuter', JSON.stringify(commuter));
        router.push('/Commuterform');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden', // Prevents unwanted scrolling
      }}
    >
      {/* Background Image Wrapper */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1, // Sends it behind the login box
          overflow: 'hidden', // Ensures the image doesn't overflow
        }}
      >
        <Image
          src="/images/esterhamor.jpg"
          alt="Background"
          layout="fill"
          objectFit="fill" 
          quality={100}
          priority
        />
      </Box>

      {/* Login Box */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          zIndex: 1, // Ensures it's above the background
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Image src="/images/sklogo3.png" alt="SK3 Logo" width={80} height={80} />
        </Box>
        <Typography variant="h5" fontWeight="bold" color="#333" gutterBottom>
          Commuter Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ marginBottom: '1rem' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ marginBottom: '1rem' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errorMessage && (
            <Typography color="error" sx={{ marginBottom: '1rem' }}>
              {errorMessage}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: 'green', color: 'white', width: '48%' }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: 'red', color: 'white', width: '48%' }}
              onClick={() => router.push('/')}
            >
              Exit
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CommuterLogin;
