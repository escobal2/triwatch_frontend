import { Map, Marker } from 'react-map-gl/mapbox';
import { useState, useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Container, Typography, TextField, Button, Grid, CssBaseline, Alert,
  Paper, MenuItem, Select, FormControl, InputLabel, Box
} from "@mui/material";
import { styled } from '@mui/system';
import axios from 'axios';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import API_BASE_URL from '@/config/apiConfig';
const MAPBOX_TOKEN = "pk.eyJ1IjoidG9tbXkyIiwiYSI6ImNtNmY4N25iYzAyZTgybXNjeGd2MnIzdTgifQ.wkAA0YApaQvYxq_gdVlNpA";

const LeftPanel = styled('div')(({ isMobile }) => ({
  backgroundColor: '#FF6A00',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  width: isMobile ? '100%' : '50%',
  height: isMobile ? 'auto' : '100vh',
}));

const RightPanel = styled(Paper)(({ isMobile }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  width: isMobile ? '100%' : '50%',
  height: isMobile ? 'auto' : '100vh',
  marginTop: isMobile ? '20px' : '0',
}));

const RootContainer = styled('div')(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  width: '100vw',
  height: '100vh',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6A00',
  color: 'white',
  padding: '10px 40px',
  marginTop: '20px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#E65C00', // Darker shade on hover
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: '10px',
  },
}));



const EmergencyReports = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
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
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);

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
    const { lng, lat } = e.lngLat;
    setLng(lng);
    setLat(lat);
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
      location: `Longitude: ${lng}, Latitude: ${lat}`,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${API_BASE_URL}/create_emergency_report`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Report submitted successfully:", response.data);
      alert("Report submitted successfully!");
  
      // Reset form after submission
      setFormData({
        fullName: "",
        contactNumber: "",
        category: "",
        complaintDetails: "",
        incident_datetime: "",
        franchise_plate_no: "",
        location: "",
        latitude: "",
        longitude: "",
      });
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit the report. Please try again.");
    }
  };  

  return (
    <RootContainer isMobile={isMobile}>
      <CssBaseline />
      <LeftPanel isMobile={isMobile}>
        <Image src="/images/sklogo3.png" alt="Logo" width={150} height={150} />
        <Image src="/images/SK3.png" alt="Logo" width={120} height={120} />
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 2 }}>
          Seguridad Kaayusan Katranquiloan asin Kauswagan
        </Typography>
      </LeftPanel>
      <RightPanel elevation={3} isMobile={isMobile}>
        <Typography component="h1" variant="h5">
          Emergency Report Form
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Contact Number" name="contactNumber" type="tel" value={formData.contactNumber} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Incident Date and Time" name="incident_datetime" type="datetime-local" value={formData.incident_datetime} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" value={formData.category} onChange={handleChange}>
                  <MenuItem value="Accident">Accident</MenuItem>
                  <MenuItem value="Hit and Run">Hit and Run</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography>Click on the map to select a location:</Typography>
              {lat !== null && lng !== null ? (
                <Map initialViewState={{ longitude: lng, latitude: lat, zoom: 14 }} style={{ width: "100%", height: "300px" }} mapStyle="mapbox://styles/mapbox/streets-v11" mapboxAccessToken={MAPBOX_TOKEN} onClick={handleMapClick}>
                  <Marker longitude={lng} latitude={lat} color="red" />
                </Map>
              ) : (
                <p>Loading map...</p>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Franchise Plate Number" name="franchise_plate_no" value={formData.franchise_plate_no} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
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
          <StyledButton type="submit" onClick={handleSubmit}>Submit Report</StyledButton>
        </form>
      </RightPanel>
    </RootContainer>
  );
};

export default EmergencyReports;
