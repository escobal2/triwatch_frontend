import { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Grid, Box, Card, CardContent,
  CardMedia, CssBaseline, Alert, MenuItem
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { useRouter } from 'next/router';
import API_BASE_URL from '@/config/apiConfig';

const SubmitAcc = async (formData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/add_account`, formData);
    alert(res.data.message);
  } catch (error) {
    console.error("Error creating account:", error);
    alert("Failed to create account.");
  }
};

const SKPersonnelAccountForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    username: "",
    password: "",
    location: "",
    role: "SK Personnel",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // You might want to add this for responsive design
  const isMobile = false; // This would typically be determined with a hook or media query

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "", 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.contactNumber.trim()) {
      errors.contactNumber = "Contact Number is required";
    }
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await SubmitAcc(formData);
        setSubmissionStatus("success");
        setFormData({
          name: "",
          contactNumber: "",
          username: "",
          password: "",
          location: "",
          role: "SK Personnel",
        });
      } catch (error) {
        setSubmissionStatus("error");
      } finally {
        setLoading(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ marginTop: 8 }}>
      <CssBaseline />
      <Card 
        sx={{ 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          borderRadius: 2,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          width: '100%',
          maxWidth: '500px',
          mb: 2,
          mx: 'auto'
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
            Create SK Personnel Account
          </Typography>
        </Box>
        
        {/* Optional: Image Banner */}
        <CardMedia 
          component="img" 
          height={isMobile ? "100" : "120"} 
          image="/images/profile.png" 
          alt="SK Personnel Profile"
          sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5', padding: '10px 0' }}
        />
        
        <CardContent sx={{ padding: isMobile ? '16px' : '24px' }}>
          {submissionStatus === "success" && (
            <Alert severity="success" sx={{ marginTop: 2, marginBottom: 2 }}>
              Account successfully created!
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Full Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required
                  variant="outlined"
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Contact Number" 
                  name="contactNumber" 
                  value={formData.contactNumber} 
                  onChange={handleChange} 
                  required
                  variant="outlined"
                  error={Boolean(formErrors.contactNumber)}
                  helperText={formErrors.contactNumber}
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
                  value={formData.username} 
                  onChange={handleChange} 
                  required
                  variant="outlined"
                  error={Boolean(formErrors.username)}
                  helperText={formErrors.username}
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
                  value={formData.password} 
                  onChange={handleChange} 
                  required
                  variant="outlined"
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required
                  variant="outlined"
                  error={Boolean(formErrors.location)}
                  helperText={formErrors.location}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Role"
                  variant="outlined"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                >
                  <MenuItem value="SK Personnel">SK Personnel</MenuItem>
                </TextField>
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
                    fontSize: '16px',
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
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#1976d2', 
                    mt: 1,
                    cursor: 'pointer'
                  }}
                  onClick={() => router.push('/login')}
                >
                  Already have an account? Login
                </Typography>
              </Grid>
            </Grid>
          </form>
          
          {submissionStatus === "error" && (
            <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Failed to create account. Please try again.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default SKPersonnelAccountForm;