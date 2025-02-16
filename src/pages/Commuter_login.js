import { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const CommuterLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${API_BASE_URL}/commuterlogin`, {
        username,
        password,
      });
  
      if (response.status === 200) {
        const commuter = response.data; // Ensure the response includes `id` and `name`
        console.log("Commuter data from API:", commuter);
        
        sessionStorage.setItem('commuter', JSON.stringify(commuter)); // Store commuter data
        router.push('/Commuterform'); // Redirect
      } else {
        setErrorMessage(response.data.message || 'Invalid username or password');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred. Please try again later.'
      );
      console.error(error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', height: '40vh', backgroundColor: '#FF6A00', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
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
                alt="Commuter Logo"
                sx={{ width: 60, height: 60, margin: '0 auto', display: 'block' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" align="center">
                Commuter Login
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

export default CommuterLogin;
