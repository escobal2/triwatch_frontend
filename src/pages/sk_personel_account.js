import { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, FormControl, InputLabel, MenuItem, Select, Alert, useMediaQuery, Paper } from "@mui/material";
import Image from 'next/image';

const RootContainer = styled('div')({
  width: '100vw',
  height: '100%',
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
});

const BackgroundImage = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/images/citystreet.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
});

const BlueOverlay = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 72, 103, 0.8)',
  zIndex: 1,
});

const ContentContainer = styled('div')({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  minHeight: '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  color: 'white',
});

const LogoContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  marginBottom: '20px',
  marginTop: '20px',
});

const StyledLogo = styled('div')({
  backgroundColor: 'white',
  borderRadius: '50%',
  padding: '5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
});

const HeaderText = styled(Typography)({
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: 'white',
  textAlign: 'center',
});

const FormContainer = styled('div')(({ isMobile }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '8px',
  padding: '30px',
  width: isMobile ? '95%' : '60%',
  maxWidth: '800px',
  marginTop: '20px',
  marginBottom: '40px',
}));

const StyledTextField = styled(TextField)({
  marginBottom: '16px',
  '& .MuiInputLabel-root': {
    color: '#004867',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#004867',
    },
    '&:hover fieldset': {
      borderColor: '#004867',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#004867',
    },
  },
});

const StyledFormControl = styled(FormControl)({
  marginBottom: '16px',
  width: '100%',
  '& .MuiInputLabel-root': {
    color: '#004867',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#004867',
    },
    '&:hover fieldset': {
      borderColor: '#004867',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#004867',
    },
  },
});

const SubmitButton = styled(Button)({
  backgroundColor: '#D32F2F',
  color: 'white',
  padding: '12px 30px',
  fontSize: '16px',
  fontWeight: 'bold',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#B71C1C',
  },
});

const SKPersonnelAccountForm = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
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
      // This is just UI demo - actual submission logic would go here
      setSubmissionStatus("success");
      setFormData({
        name: "",
        contactNumber: "",
        username: "",
        password: "",
        location: "",
        role: "SK Personnel",
      });
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <RootContainer>
      <BackgroundImage />
      <BlueOverlay />
      <ContentContainer>
        <HeaderText variant="h6">
          Seguridad Kaayusan Katranguilohan Kauswagan
        </HeaderText>
        
        <LogoContainer>
          <StyledLogo>
            <Image src="/images/sklogo3.png" alt="Transport Logo" width={80} height={80} />
          </StyledLogo>
          <StyledLogo>
            <Image src="/images/cityseal1.png" alt="City Seal" width={80} height={80} />
          </StyledLogo>
        </LogoContainer>
        
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>
          CREATE SK PERSONNEL ACCOUNT
        </Typography>

        <FormContainer isMobile={isMobile}>
          {submissionStatus === "success" && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Account successfully created!
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Contact Number"
                  variant="outlined"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  error={Boolean(formErrors.contactNumber)}
                  helperText={formErrors.contactNumber}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Location"
                  variant="outlined"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={Boolean(formErrors.location)}
                  helperText={formErrors.location}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={Boolean(formErrors.username)}
                  helperText={formErrors.username}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledFormControl variant="outlined">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    label="Role"
                  >
                    <MenuItem value="SK Personnel">SK Personnel</MenuItem>
                  </Select>
                </StyledFormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <SubmitButton type="submit" variant="contained">
                  Create Account
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        </FormContainer>
      </ContentContainer>
    </RootContainer>
  );
};

export default SKPersonnelAccountForm;