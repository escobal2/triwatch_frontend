import { useState } from 'react';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha'; // Import reCAPTCHA
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const CreateCommuterAccount = () => {
  const router = useRouter();
  const [commuterData, setCommuterData] = useState({
    name: '',
    username: '',
    password: '',
    validId: null, // Store the uploaded file
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null); // Store reCAPTCHA response

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommuterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCommuterData((prevData) => ({
      ...prevData,
      validId: e.target.files[0], // Store uploaded file
    }));
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!captchaValue) {
      alert('Please verify the reCAPTCHA');
      setLoading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('name', commuterData.name);
    formData.append('username', commuterData.username);
    formData.append('password', commuterData.password);
    formData.append('valid_id', commuterData.validId);
    formData.append('g-recaptcha-response', captchaValue); // 🔥 Ensure it's being sent
  
    console.log("Sending data:", Object.fromEntries(formData)); // Log request data
  
    try {
      const response = await axios.post(`${API_BASE_URL}/commuter_create_account`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 201) {
        setDialogOpen(true);
        setCommuterData({ name: '', username: '', password: '', validId: null });
      } else {
        alert('Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Error creating commuter account:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred while creating the account.');
    } finally {
      setLoading(false);
    }
  };
  
  

  const handleDialogClose = () => {
    setDialogOpen(false);
    router.push('/Commuter_login');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Create Commuter Account
      </Typography>
      <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
        <CardMedia component="img" height="140" image="/images/profile.png" alt="Commuter Profile" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label="Full Name" name="name" value={commuterData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Username" name="username" value={commuterData.username} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth type="password" label="Password" name="password" value={commuterData.password} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary">
                  Upload a valid ID (Preferably City ID)
                </Typography>
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA sitekey="6LcE5c4qAAAAAHsHCBKBMBxSWghIM6NkTd9mgobL" onChange={handleCaptchaChange} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#FF6A00', '&:hover': { backgroundColor: '#FF6A00' } }} disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && <Typography color="error" variant="body2">{error}</Typography>}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Account Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Proceed to Login?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            Yes
          </Button>
          <Button onClick={() => setDialogOpen(false)} color="secondary" variant="outlined">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateCommuterAccount;
