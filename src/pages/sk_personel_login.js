import { useState } from 'react';
import Image from 'next/image';
import { TextField, Button, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const SkpersonelLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        username,
        password,
      });

      if (response.data.success) {
        const { id } = response.data.user;
        router.push(`/sk_personel/${id}`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
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
    src="/images/hamol.jpg"
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
          SK Personnel Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email or LTO Client Number"
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
          {error && (
            <Typography color="error" sx={{ marginBottom: '1rem' }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#FF6A00', color: 'white', width: '48%' }}
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

export default SkpersonelLogin;
