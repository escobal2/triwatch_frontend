import { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Box, CssBaseline, Alert,
  MenuItem, InputLabel, FormControl, Select, Paper
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

  // Custom styles to match the provided design
  const inputStyle = {
    borderRadius: '4px',
    border: '1px solid #ccc',
    padding: '8px 12px',
    width: '100%',
    backgroundColor: 'white',
    fontSize: '16px',
    height: '42px',
    '&:focus': {
      borderColor: '#2684FF',
      boxShadow: '0 0 0 1px #2684FF',
    }
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#333',
    fontWeight: '500'
  };

  return (
    <Container component="main" maxWidth="md" sx={{ marginTop: 4, marginBottom: 4 }}>
      <CssBaseline />
      <Paper 
        sx={{ 
          padding: 3,
          backgroundColor: '#f0f6fa',
          border: '1px solid #cfd8dc',
          borderRadius: '4px'
        }}
      >
        {submissionStatus === "success" && (
          <Alert severity="success" sx={{ marginBottom: 3 }}>
            Account successfully created!
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {/* First row */}
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <InputLabel htmlFor="name" sx={labelStyle}>Full Name</InputLabel>
              <TextField
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    ...inputStyle
                  }
                }}
                placeholder="Enter full name"
                InputProps={{ sx: { height: '42px' } }}
              />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <InputLabel htmlFor="contactNumber" sx={labelStyle}>Contact Number</InputLabel>
              <TextField
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                error={Boolean(formErrors.contactNumber)}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    ...inputStyle
                  }
                }}
                placeholder="+63XXXXXXXXXX"
                InputProps={{ sx: { height: '42px' } }}
              />
            </Box>
          </Box>
          
          {/* Second row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <InputLabel htmlFor="role" sx={labelStyle}>Role</InputLabel>
              <FormControl fullWidth variant="outlined">
                <Select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  sx={{ 
                    height: '42px',
                    '& .MuiOutlinedInput-root': {
                      ...inputStyle
                    }
                  }}
                >
                  <MenuItem value="SK Personnel">SK Personnel</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ flex: 1, minWidth: '250px' }}>
              <InputLabel htmlFor="location" sx={labelStyle}>Location</InputLabel>
              <TextField
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={Boolean(formErrors.location)}
                fullWidth
                variant="outlined"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    ...inputStyle
                  }
                }}
                placeholder="Enter location"
                InputProps={{ sx: { height: '42px' } }}
              />
            </Box>
          </Box>
          
          {/* Third row */}
          <Box sx={{ mb: 3 }}>
            <InputLabel htmlFor="username" sx={labelStyle}>Username</InputLabel>
            <TextField
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={Boolean(formErrors.username)}
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  ...inputStyle
                }
              }}
              placeholder="Enter username"
              InputProps={{ sx: { height: '42px' } }}
            />
          </Box>
          
          {/* Fourth row */}
          <Box sx={{ mb: 4 }}>
            <InputLabel htmlFor="password" sx={labelStyle}>Password</InputLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(formErrors.password)}
              fullWidth
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  ...inputStyle
                }
              }}
              placeholder="Enter password"
              InputProps={{ sx: { height: '42px' } }}
            />
          </Box>
          
          {/* Submit button */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#dc3545',
                color: 'white',
                padding: '10px 24px',
                fontSize: '16px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: '#c82333',
                },
              }}
            >
              {loading ? 'Creating Account...' : 'Creat Account'}
            </Button>
          </Box>
          
        </form>
        
        {submissionStatus === "error" && (
          <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Failed to create account. Please try again.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default SKPersonnelAccountForm;