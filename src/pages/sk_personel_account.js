import { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Box, CssBaseline, Alert,
  MenuItem, InputLabel, FormControl, Select, Paper, Grid
} from "@mui/material";
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
    <Container 
      component="main" 
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: '100%', md: '900px' },
        margin: '0 auto',
        padding: { xs: '16px', sm: '24px' },
      }}
    >
      <CssBaseline />
      <Paper 
        elevation={2}
        sx={{ 
          padding: { xs: '16px', sm: '24px', md: '32px' },
          backgroundColor: '#f0f6fa',
          border: '1px solid #cfd8dc',
          borderRadius: '4px',
          width: '100%'
        }}
      >
        {submissionStatus === "success" && (
          <Alert 
            severity="success" 
            sx={{ 
              marginBottom: { xs: '16px', sm: '24px' },
              width: '100%'
            }}
          >
            Account successfully created!
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={2}>
            {/* First row */}
            <Grid item xs={12} sm={6}>
              <InputLabel 
                htmlFor="name" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Full Name
              </InputLabel>
              <TextField
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                fullWidth
                variant="outlined"
                placeholder="Enter full name"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabel 
                htmlFor="contactNumber" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Contact Number
              </InputLabel>
              <TextField
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                error={Boolean(formErrors.contactNumber)}
                helperText={formErrors.contactNumber}
                fullWidth
                variant="outlined"
                placeholder="+63XXXXXXXXXX"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            {/* Second row */}
            <Grid item xs={12} sm={6}>
              <InputLabel 
                htmlFor="role" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Role
              </InputLabel>
              <FormControl fullWidth variant="outlined" size="small">
                <Select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  <MenuItem value="SK Personnel">SK Personnel</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <InputLabel 
                htmlFor="location" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Location
              </InputLabel>
              <TextField
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={Boolean(formErrors.location)}
                helperText={formErrors.location}
                fullWidth
                variant="outlined"
                placeholder="Enter location"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            {/* Third row */}
            <Grid item xs={12}>
              <InputLabel 
                htmlFor="username" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Username
              </InputLabel>
              <TextField
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(formErrors.username)}
                helperText={formErrors.username}
                fullWidth
                variant="outlined"
                placeholder="Enter username"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            {/* Fourth row */}
            <Grid item xs={12}>
              <InputLabel 
                htmlFor="password" 
                sx={{ 
                  marginBottom: '6px',
                  fontSize: { xs: '13px', sm: '14px' },
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                Password
              </InputLabel>
              <TextField
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                fullWidth
                variant="outlined"
                placeholder="Enter password"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  }
                }}
              />
            </Grid>
            
            {/* Submit button */}
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '16px' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: { xs: '8px 16px', sm: '10px 24px' },
                  fontSize: { xs: '14px', sm: '16px' },
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: '#c82333',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Grid>
          </Grid>
        </form>
        
        {submissionStatus === "error" && (
          <Typography 
            color="error" 
            variant="body2" 
            sx={{ 
              marginTop: '16px', 
              textAlign: 'center',
              width: '100%'
            }}
          >
            Failed to create account. Please try again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SKPersonnelAccountForm;