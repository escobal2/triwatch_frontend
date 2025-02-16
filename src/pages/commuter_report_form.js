import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Grid, CssBaseline, Paper, MenuItem, Select, FormControl, InputLabel, Box, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from "@mui/material";
import { styled } from '@mui/system';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

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

const StyledButton = styled(Button)({
  backgroundColor: '#FF6A00',
  color: 'white',
  padding: '10px 20px',
  marginTop: '20px',
});

const MAPBOX_TOKEN = 'pk.eyJ1IjoidG9tbXkyIiwiYSI6ImNtNmY4N25iYzAyZTgybXNjeGd2MnIzdTgifQ.wkAA0YApaQvYxq_gdVlNpA';

const ReportForm = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();

  const [formData, setFormData] = useState({
    commuterName: "",
    commuterContact: "",
    fullName: "",
    contactNumber: "",
    category: "",
    complaintDetails: "",
    incident_datetime: "",
    location: "",
    franchise_plate_no: "",
    latitude: "",  // Add this
    longitude: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mapbox Ref
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(null);
  const [lat, setLat] = useState(null);
  const [commuter, setCommuter] = useState(null);
  const [commuterId, setCommuterId] = useState(null);
  const [commuterName, setCommuterName] = useState("");
  const [commuterContact, setCommuterContact] = useState("");



  // Initialize Mapbox on mount and use Geolocation API for current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          console.log("User Location:", userLat, userLng); // Debugging

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
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const handleContactNumberChange = (e) => {
    let value = e.target.value;

    if (value.startsWith('0')) {
      value = '+63' + value.slice(1);
    }

    if (value.length > 13) {
      value = value.slice(0, 13);
    }

    setFormData({
      ...formData,
      contactNumber: value,
    });

    setFormErrors({
      ...formErrors,
      contactNumber: "",
    });
  };

  useEffect(() => {
    const storedCommuter = sessionStorage.getItem("commuter");
    if (storedCommuter) {
      const parsedCommuter = JSON.parse(storedCommuter);
      console.log("Retrieved from sessionStorage:", parsedCommuter);

      setCommuterId(parsedCommuter?.id || null);
      
      // Populate form fields with stored data
      setFormData({
        fullName: parsedCommuter?.name?.trim() || "Unknown",
        contactNumber: parsedCommuter?.contactnum?.trim() || "N/A",
      });
    }
  }, []);

  useEffect(() => {
    if (!commuterId) {
      console.warn("No commuterId found!");
      return;
    }

    const fetchCommuterData = async () => {
      try {
        console.log(`Fetching data for ID: ${commuterId}`);
        const { data } = await axios.get(`${API_BASE_URL}/commuter/${commuterId}`);
        console.log("API Response:", data);

        // Update form fields with fetched data
        setFormData({
          fullName: data?.name || "Unknown",
          contactNumber: data?.contactnum || "N/A",
        });
      } catch (error) {
        console.error("API Error:", error);
        setFormData({
          fullName: (response.data?.name || "Unknown").trim(),
          contactNumber: (response.data?.contactnum || "N/A").trim(),
        });
      }
    };

    fetchCommuterData();
  }, [commuterId]);

  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = "Full Name is required";
    if (!formData.contactNumber.trim()) errors.contactNumber = "Contact Number is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.complaintDetails.trim()) errors.complaintDetails = "Details of Complaint are required";
    if (!formData.incident_datetime) errors.incident_datetime = "Incident Date and Time is required";
    if (!formData.location.trim()) errors.location = "Location is required";
    if (!formData.franchise_plate_no.trim()) errors.franchise_plate_no = "Franchise Plate Number is required";
    if (!formData.latitude || !formData.longitude) errors.location = "Please select a location on the map";

    if (Object.keys(errors).length === 0) {
      try {
        const res = await axios.post(`${API_BASE_URL}/add_report`, formData);

        setSubmissionStatus("success");
        setFormData({
          commuterName: "",
          commuterContact: "",
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

        setOpenDialog(true);
      } catch (error) {
        console.error("Error submitting report:", error);
        alert("Failed to submit report.");
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
          Report Form
        </Typography>
        {submissionStatus === "success" && (
          <Alert severity="success" sx={{ marginTop: 2 }}>
            Form submitted successfully!
          </Alert>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                name="name"
                value={formData.fullName}
                disabled // Make it non-editable
              />
            </Grid>
            <Grid item xs={12}>
            <TextField
                fullWidth
                label="Contact Number"
                variant="outlined"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                disabled // Make it non-editable
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
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
                  <MenuItem value="Overcharging">Overcharging</MenuItem>
                  <MenuItem value="Assault">Assault</MenuItem>
                  <MenuItem value="Lost Belonging">Lost Belonging</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
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
              <Typography>Click on the map to select a location:</Typography>
              {lat !== null && lng !== null ? (
        <Map
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 14,
          }}
          style={{ width: "100%", height: "300px" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={handleMapClick}
        >
          <Marker longitude={lng} latitude={lat} color="red" />
        </Map>
      ) : (
        <p>Loading map...</p>
      )}
            </Grid>
            <Grid item xs={12}>
              <TextField
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
          <StyledButton type="submit">Submit Report</StyledButton>
        </form>
      </RightPanel>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Report Submitted</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Your report has been successfully submitted!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default ReportForm;
