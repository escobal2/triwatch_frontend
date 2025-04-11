import { useState } from 'react';
import { Container, Typography, TextField, Button, Grid, Paper, CssBaseline, Alert, MenuItem } from "@mui/material";
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
      }
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ marginTop: 8 }}>
      <CssBaseline />
      <Paper elevation={3} sx={{ padding: 5, textAlign: 'center', marginBottom: 4 }}>
        <Typography component="h1" variant="h5">
          Create SK Personnel Account
        </Typography>
        {submissionStatus === "success" && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            Account successfully created!
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ marginTop: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
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
            <Grid item xs={12}>
              <TextField
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
            <Grid item xs={12}>
              <TextField
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
            <Grid item xs={12}>
              <TextField
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
              <TextField
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
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Role"
                variant="outlined"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="SK Personnel">SK Personnel</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: '#FF6A00',
                  '&:hover': { backgroundColor: '#FF6A00' },
                }}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SKPersonnelAccountForm;
