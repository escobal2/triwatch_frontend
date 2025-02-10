import { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import API_BASE_URL from '@/config/apiConfig';
import Image from 'next/image';

const AdminLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sending the username and password to the backend
    try {
      const response = await fetch(`${API_BASE_URL}/adminlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // On successful login, redirect to Admin_Form
        router.push('/Admin_Form');
      } else {
        // On failure, show error message
        setErrorMessage(data.message || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error(error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
    
      <Box sx={{ width: '100%', height: '40vh', backgroundColor: '#FF6A00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      </Box>

      
      <Box sx={{ width: '100%', backgroundColor: 'white', flex: 1 }} />

      
      <Container 
        maxWidth="xs" 
        sx={{
          position: 'absolute', 
          top: '15vh',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            
            <Grid item xs={12}>
              <Box
                component="img"
                src="/images/sklogo3.png" 
                alt="SK3 Logo"
                sx={{ width: 60, height: 60, margin: '0 auto', display: 'block' }}
              />
            </Grid>

            
            <Grid item xs={12}>
              <Box
                component="img"
                src="/images/SK3.png" 
                alt="SK3 Text"
                sx={{ width: 50, height: 30, margin: '0 auto', display: 'block' }}
              />
              <Typography variant="h6" align="center">
                Admin Login
              </Typography>
            </Grid>

            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            {errorMessage && (
              <Grid item xs={12}>
                <Typography color="error">{errorMessage}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" style={{ backgroundColor: '#FF6A00' }} fullWidth>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  );
};

export default AdminLogin;
