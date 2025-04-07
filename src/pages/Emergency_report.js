import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Typography, TextField, Button, Grid, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import { styled } from '@mui/system';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import { Map, Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const MapContainer = styled('div')({
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '16px',
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

const MAPBOX_TOKEN = 'pk.eyJ1IjoidG9tbXkyIiwiYSI6ImNtNmY4N25iYzAyZTgybXNjeGd2MnIzdTgifQ.wkAA0YApaQvYxq_gdVlNpA';

const EmergencyReports = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    category: '',
    complaintDetails: '',
    incident_datetime: '',
    franchise_plate_no: '',
    location: '',
    latitude: "",
    longitude: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);

  // Initialize map and user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          setLat(userLat);
          setLng(userLng);

          setFormData((prev) => ({
            ...prev,
            latitude: userLat,
            longitude: userLng,
            location: `Latitude: ${userLat}, Longitude: ${userLng}`,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleMapClick = (e) => {
    const { lng: newLng, lat: newLat } = e.lngLat;
    setLng(newLng);
    setLat(newLat);
    setFormData({
      ...formData,
      latitude: newLat,
      longitude: newLng,
      location: `Longitude: ${newLng}, Latitude: ${newLat}`,
    });
  };

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

    // Validate form fields
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact number is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.complaintDetails.trim()) errors.complaintDetails = "Details of complaint are required";
    if (!formData.incident_datetime) errors.incident_datetime = "Incident date and time is required";
    if (!formData.franchise_plate_no.trim()) errors.franchise_plate_no = "Franchise plate number is required";
    if (!formData.latitude || !formData.longitude) errors.location = "Please select a location on the map";

    if (Object.keys(errors).length === 0) {
      try {
        await axios.post(`${API_BASE_URL}/create_emergency_report`, formData);
        setSubmissionStatus("success");
        setOpenDialog(true);
        
        // Reset form
        setFormData({
          fullName: "",
          contactNumber: "",
          category: "",
          complaintDetails: "",
          incident_datetime: "",
          location: "",
          franchise_plate_no: "",
          latitude: "",
          longitude: "",
        });
      } catch (error) {
        console.error("Error submitting report:", error);
        setSubmissionStatus("error");
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    router.push('/Commuterform');
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
          EMERGENCY REPORT FORM
        </Typography>

        <FormContainer isMobile={isMobile}>
          {submissionStatus === "success" && (
            <Alert severity="success" sx={{ marginBottom: 2 }}>
              Form submitted successfully!
            </Alert>
          )}
          {submissionStatus === "error" && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              Failed to submit report. Please try again.
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={Boolean(formErrors.fullName)}
                  helperText={formErrors.fullName}
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
                <StyledFormControl variant="outlined">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    label="Category"
                    error={Boolean(formErrors.category)}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    <MenuItem value="Accident">Accident</MenuItem>
                    <MenuItem value="Hit and Run">Hit and Run</MenuItem>
                  </Select>
                  {formErrors.category && (
                    <Typography color="error" variant="caption">
                      {formErrors.category}
                    </Typography>
                  )}
                </StyledFormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Incident Date and Time"
                  variant="outlined"
                  type="datetime-local"
                  name="incident_datetime"
                  value={formData.incident_datetime}
                  onChange={handleChange}
                  error={Boolean(formErrors.incident_datetime)}
                  helperText={formErrors.incident_datetime}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Franchise Plate Number"
                  variant="outlined"
                  name="franchise_plate_no"
                  value={formData.franchise_plate_no}
                  onChange={handleChange}
                  error={Boolean(formErrors.franchise_plate_no)}
                  helperText={formErrors.franchise_plate_no}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ color: '#004867', marginBottom: '8px' }}>
                  Click on the map to select incident location:
                </Typography>
                <MapContainer>
                  {lat !== null && lng !== null ? (
                    <Map
                      initialViewState={{
                        longitude: lng,
                        latitude: lat,
                        zoom: 14,
                      }}
                      style={{ width: "100%", height: "100%" }}
                      mapStyle="mapbox://styles/mapbox/streets-v11"
                      mapboxAccessToken={MAPBOX_TOKEN}
                      onClick={handleMapClick}
                    >
                      <Marker longitude={lng} latitude={lat} color="red" />
                    </Map>
                  ) : (
                    <Typography align="center" sx={{ padding: '20px' }}>Loading map...</Typography>
                  )}
                </MapContainer>
                {formErrors.location && (
                  <Typography color="error" variant="caption">
                    {formErrors.location}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Complaint Details"
                  variant="outlined"
                  name="complaintDetails"
                  value={formData.complaintDetails}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  error={Boolean(formErrors.complaintDetails)}
                  helperText={formErrors.complaintDetails}
                />
              </Grid>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SubmitButton type="submit" variant="contained">
                Submit Report
              </SubmitButton>
            </div>
          </form>
        </FormContainer>
      </ContentContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose}
        PaperProps={{
          style: {
            borderRadius: '8px',
            padding: '10px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#004867', fontWeight: 'bold' }}>Report Submitted</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your emergency report has been successfully submitted. The authorities will review your report and take appropriate action immediately.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDialogClose} 
            sx={{ 
              backgroundColor: '#004867', 
              color: 'white',
              '&:hover': {
                backgroundColor: '#003652',
              }
            }}
          >
            Return to Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default EmergencyReports;