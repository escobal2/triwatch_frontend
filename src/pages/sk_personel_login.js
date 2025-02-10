import { useState } from 'react';
import { Container, Grid, TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
const SkpersonelLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`http://127.0.0.1:8000/login`, {
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
                alt="SK Logo"
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
                SK Personnel Login
              </Typography>
              {error && <Typography color="error" align="center">{error}</Typography>}
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

export default SkpersonelLogin;
