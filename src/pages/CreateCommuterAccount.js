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
    contactnum: '',
    username: '',
    password: '',
    validId: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  // Function to handle contact number formatting
  const handleContactNumberChange = (e) => {
    let value = e.target.value;
    if (value.startsWith('0')) {
      value = '+63' + value.slice(1);
    }
    if (value.length > 13) {
      value = value.slice(0, 13);
    }
    setCommuterData((prevData) => ({ ...prevData, contactnum: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCommuterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCommuterData((prevData) => ({
      ...prevData,
      validId: e.target.files[0],
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
    formData.append('contactnum', commuterData.contactnum);
    formData.append('username', commuterData.username);
    formData.append('password', commuterData.password);
    formData.append('valid_id', commuterData.validId);
    formData.append('g-recaptcha-response', captchaValue);

    console.log("Sending data:", Object.fromEntries(formData));

    try {
      const response = await axios.post(`${API_BASE_URL}/commuter_create_account`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setDialogOpen(true);
        setCommuterData({ name: '', username: '', password: '', contactnum: '', validId: null });
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
    setVerificationDialogOpen(true); // Show verification message after closing success dialog
  };

  const handleVerificationClose = () => {
    setVerificationDialogOpen(false);
    router.push('/Commuter_login'); // Redirect to login page after acknowledgment
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
                <TextField 
                  fullWidth 
                  label="Contact Number" 
                  name="contactnum" 
                  value={commuterData.contactnum} 
                  onChange={handleContactNumberChange} 
                  required 
                />
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
                <ReCAPTCHA sitekey="6Le5MvAqAAAAAKtoMVjkdjwumXnJNx4YpwThs_Ms" onChange={handleCaptchaChange} />
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

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Account Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your account has been created. Please wait while the admin verifies your account.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" variant="contained">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Pending Dialog */}
      <Dialog open={verificationDialogOpen} onClose={handleVerificationClose}>
        <DialogTitle>Verification in Progress</DialogTitle>
        <DialogContent>
          <Typography>Your account is currently under verification. You will receive a text message once your account is approved.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVerificationClose} color="primary" variant="contained">
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CreateCommuterAccount;
