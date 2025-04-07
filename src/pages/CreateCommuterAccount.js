import { useState } from 'react';
import { useRouter } from 'next/router';
import ReCAPTCHA from 'react-google-recaptcha';
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
  Box,
  useMediaQuery,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import Link from 'next/link';
import Image from 'next/image';

const CreateCommuterAccount = () => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  
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
  const [fileName, setFileName] = useState('');

  // Responsive styling
  const getFontSize = (baseSize) => {
    if (isMobile) return `${baseSize * 0.7}px`;
    if (isTablet) return `${baseSize * 0.85}px`;
    return `${baseSize}px`;
  };

  const getCityLogoSize = () => {
    if (isMobile) return 30;
    return 50;
  };

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
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setCommuterData((prevData) => ({
        ...prevData,
        validId: e.target.files[0],
      }));
    }
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

    try {
      const response = await axios.post(`${API_BASE_URL}/commuter_create_account`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 201) {
        setDialogOpen(true);
        setCommuterData({ name: '', username: '', password: '', contactnum: '', validId: null });
        setFileName('');
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
    setVerificationDialogOpen(true);
  };

  const handleVerificationClose = () => {
    setVerificationDialogOpen(false);
    router.push('/Commuter_login');
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("/images/citystreet.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1,
        }}
      />
      
      {/* Overlay with scrollable content */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 78, 115, 0.8)',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            width: '100%',
            padding: isMobile ? '10px' : '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            zIndex: 10,
            boxSizing: 'border-box',
          }}
        >
          <Link href="/" passHref legacyBehavior>
            <IconButton sx={{ color: 'white', mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
          </Link>
          <Box display="flex" alignItems="center">
            <Image 
              src="/images/cityseal1.png" 
              alt="City of Sorsogon" 
              width={getCityLogoSize()} 
              height={getCityLogoSize()} 
            />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                marginLeft: isMobile ? 1 : 2, 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: getFontSize(isMobile ? 14 : 18)
              }}
            >
              CITY OF SORSOGON
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
            px: isMobile ? 2 : 3,
            pb: 4,
          }}
        >
          <Card 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
              borderRadius: 2,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.95)',
              width: '100%',
              maxWidth: '500px',
              mb: 2,
            }}
          >
            <Box 
              sx={{ 
                backgroundColor: '#004e73', 
                color: 'white', 
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <PersonAddIcon sx={{ mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                Create Commuter Account
              </Typography>
            </Box>
            
            {/* Optional: Image Banner */}
            <CardMedia 
              component="img" 
              height={isMobile ? "100" : "120"} 
              image="/images/profile.png" 
              alt="Commuter Profile"
              sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5', padding: '10px 0' }}
            />
            
            <CardContent sx={{ padding: isMobile ? '16px' : '24px' }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Full Name" 
                      name="name" 
                      value={commuterData.name} 
                      onChange={handleChange} 
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Contact Number" 
                      name="contactnum" 
                      value={commuterData.contactnum} 
                      onChange={handleContactNumberChange} 
                      required 
                      placeholder="+639XXXXXXXXX"
                      helperText="Format: +639XXXXXXXXX"
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Username" 
                      name="username" 
                      value={commuterData.username} 
                      onChange={handleChange} 
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      type="password" 
                      label="Password" 
                      name="password" 
                      value={commuterData.password} 
                      onChange={handleChange} 
                      required
                      variant="outlined"
                      InputProps={{
                        sx: { borderRadius: '8px' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Upload a valid ID (Preferably City ID)
                    </Typography>
                    <Box 
                      sx={{ 
                        border: '1px dashed #aaa', 
                        borderRadius: '8px', 
                        padding: '12px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#f8f8f8',
                        '&:hover': {
                          backgroundColor: '#f0f0f0'
                        }
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        required
                        id="file-upload"
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                        <Typography variant="body2" sx={{ color: '#004e73', fontWeight: 'medium' }}>
                          {fileName || 'Click to upload file'}
                        </Typography>
                      </label>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                      <ReCAPTCHA 
                        sitekey="6LcE5c4qAAAAAHsHCBKBMBxSWghIM6NkTd9mgobL" 
                        onChange={handleCaptchaChange}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      fullWidth 
                      sx={{ 
                        backgroundColor: '#42a5f5',
                        color: 'white',
                        height: '50px',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontSize: getFontSize(16),
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#1976d2',
                        },
                      }} 
                      disabled={loading}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Grid>

                  <Grid item xs={12} sx={{ textAlign: 'center' }}>
                    <Link href="/Commuter_login" passHref legacyBehavior>
                      <a style={{ textDecoration: 'none' }}>
                        <Typography variant="body2" sx={{ color: '#1976d2', mt: 1 }}>
                          Already have an account? Login
                        </Typography>
                      </a>
                    </Link>
                  </Grid>
                </Grid>
              </form>
              {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>

          <Box sx={{ textAlign: 'center', mt: 1, mb: 3 }}>
            <Link href="/" passHref legacyBehavior>
              <a style={{ textDecoration: 'none' }}>
                <Button 
                  variant="text" 
                  sx={{ 
                    color: 'white',
                    textTransform: 'none',
                    fontSize: getFontSize(14)
                  }}
                >
                  Back to Home
                </Button>
              </a>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Success Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: { borderRadius: '8px' }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#004e73', color: 'white' }}>
          Account Created Successfully
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px' }}>
          <Typography>Your account has been created. Please wait while the admin verifies your account.</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDialogClose} 
            variant="contained"
            sx={{ 
              backgroundColor: '#42a5f5',
              '&:hover': { backgroundColor: '#1976d2' },
              textTransform: 'none'
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Pending Dialog */}
      <Dialog 
        open={verificationDialogOpen} 
        onClose={handleVerificationClose}
        PaperProps={{
          sx: { borderRadius: '8px' }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#004e73', color: 'white' }}>
          Verification in Progress
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '20px' }}>
          <Typography>Your account is currently under verification. You will receive a text message once your account is approved.</Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleVerificationClose} 
            variant="contained"
            sx={{ 
              backgroundColor: '#42a5f5',
              '&:hover': { backgroundColor: '#1976d2' },
              textTransform: 'none'
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CreateCommuterAccount;