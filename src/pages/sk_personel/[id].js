import { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Grid, Divider, Box, 
  Card, CardContent, CardHeader, Avatar, IconButton,
  Paper, AppBar, Toolbar, Badge, Chip, useMediaQuery,
  useTheme, Menu, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, Alert
} from '@mui/material';
import { 
  ExitToApp, AccountCircle, Camera, CheckCircle, 
  Cancel, LocationOn, DateRange, Phone, Info,
  Menu as MenuIcon, Notifications, Send
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Tesseract from "tesseract.js";
import API_BASE_URL from '@/config/apiConfig';
import axios from 'axios';

const SKPersonelForm = () => {
  const [complaints, setComplaints] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Notification related states
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const router = useRouter();
  const { id, fullname} = router.query;
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({ id: '', fullname: '' });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Menu handling
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Logout function
  const handleLogout = () => {
    // Clear session data
    sessionStorage.removeItem('skPersonnel');
    router.push('/sk_personel_login');
    handleMenuClose();
  };

 // At the top of your component

useEffect(() => {
  // Only run this once the router is ready
  if (!router.isReady) return;
  
  try {
    const skPersonnel = sessionStorage.getItem('skPersonnel');
    
    if (!skPersonnel) {
      console.log("No session found, redirecting to login");
      router.push('/sk_personel_login');
      return;
    }
    
    const parsedData = JSON.parse(skPersonnel);
    
    // Set both userData and userId for consistency
    setUserData({
      id: parsedData.id,
      fullname: parsedData.fullname
    });
    setUserId(parsedData.id);
    
    // Only redirect if there's an ID mismatch in the URL
    if (id && parsedData.id.toString() !== id.toString()) {
      console.log("ID mismatch, redirecting to correct profile");
      router.push(`/sk_personel/${parsedData.id}`);
    }
    
    setIsLoading(false);
  } catch (error) {
    console.error("Session verification error:", error);
    router.push('/sk_personel_login');
  }
}, [router.isReady, id]);

  // Fetch complaints assigned to SK personnel
  useEffect(() => {
    // Don't fetch until we have a valid userId and router is ready
    if (!userId || isLoading) return;
    
    console.log("Fetching complaints for user ID:", userId);
    
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/assigned-reports/${userId}`);
        if (response.data && response.data.retrieved_data) {
          const activeComplaints = response.data.retrieved_data.filter(
            c => c.status !== 'dismissed' && c.status !== 'resolved'
          );
          setComplaints(activeComplaints);
        }
      } catch (error) {
        console.error('Error fetching complaints:', error);
      }
    };
    
    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000);
    
    return () => clearInterval(interval);
  }, [userId, isLoading]);

  const fetchSKPersonnel = async (personnelId) => {
    if (!personnelId) {
      console.error("No personnel ID provided.");
      return null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/sk_personnel/${personnelId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching SK personnel:", error.response?.data || error.message);
      return null;
    }
  };

  // Enhanced ticket number extraction with multiple approaches
  const extractTicketNumber = async (imageFile) => {
    setIsProcessing(true);
    try {
      // Configure Tesseract with specific options for better digit recognition
      const { data } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m),
        tessedit_char_whitelist: '0123456789NTRAFFIC°:VIOLATIONSRECEIPT', // Focus on relevant characters
        tessedit_pageseg_mode: '4', // Assume a single column of text
      });

      const text = data.text;
      console.log("Full extracted text:", text);

      // Method 1: Try to find the ticket number by looking for the pattern "N°: [digits]"
      const ticketPattern = /N[o°:][:.]?\s*(\d+)/i;
      const ticketMatch = text.match(ticketPattern);
      
      if (ticketMatch && ticketMatch[1]) {
        return ticketMatch[1];
      }
      
      // Method 2: If that fails, look for the red number in the top right (usually longer digits)
      // This searches for 6+ digit numbers which are likely to be ticket numbers
      const longNumberPattern = /\b\d{6,}\b/;
      const longNumberMatch = text.match(longNumberPattern);
      
      if (longNumberMatch) {
        return longNumberMatch[0];
      }
      
      // Method 3: If both above methods fail, extract all numbers and pick the longest one
      // as it&apos;s more likely to be the ticket number
      const allNumbers = text.match(/\d+/g) || [];
      const sortedByLength = allNumbers.sort((a, b) => b.length - a.length);
      
      if (sortedByLength.length > 0) {
        return sortedByLength[0];
      }
      
      // If all fails, return N/A
      return "N/A";
    } catch (error) {
      console.error("Error extracting ticket number:", error);
      return "Error extracting ticket number";
    } finally {
      setIsProcessing(false);
    }
  };

  // Resolve Complaint with enhanced ticket extraction
  const resolveComplaint = async (complaintId, personnelId) => {
    const resolution = prompt("Enter resolution for this complaint:");
    if (!resolution) return;
  
    if (!image || selectedComplaintId !== complaintId) {
      alert("Please select an image for ticket extraction.");
      return;
    }
  
    try {
      // Extract ticket number using our enhanced method
      const extractedTicketNumber = await extractTicketNumber(image);
      setExtractedText(extractedTicketNumber);
      alert(`Extracted Ticket Number: ${extractedTicketNumber}`);
  
      // Fetch SK personnel details
      const skPersonnel = await fetchSKPersonnel(personnelId);
      if (!skPersonnel) {
        alert("Failed to fetch SK personnel details.");
        return;
      }
  
      // Send resolution details along with SK personnel name
      const response = await axios.post(`${API_BASE_URL}/add-resolution/${complaintId}`, {
        resolution,
        ticket_number: extractedTicketNumber,
        resolved_by: skPersonnel.id,
        resolved_by_name: skPersonnel.fullname,
      });
  
      // Find the complaint and update ticket count in UI
      setComplaints((prevComplaints) =>
        prevComplaints.map((c) =>
          c.franchise_plate_no === response.data.franchise_plate_no
            ? { ...c, ticket_count: response.data.ticket_count }
            : c
        )
      );
  
      alert("Complaint resolved successfully!");
    } catch (error) {
      console.error("Error during resolution:", error);
      alert("An error occurred while resolving the complaint.");
    }
  };
  
  const dismissComplaint = async (complaintId, personnelId) => {
    const reason = prompt("Enter reason for dismissal:");
    if (!reason) {
      alert("Dismissal reason is required.");
      return;
    }
  
    // Fetch SK personnel details from backend
    const skPersonnel = await fetchSKPersonnel(personnelId);
  
    if (!skPersonnel) {
      alert("SK personnel not found.");
      return;
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/dismiss-complaint/${complaintId}`, {
        dismiss_reason: reason,
        dismissed_by: skPersonnel.id,
        dismissed_by_name: skPersonnel.fullname,
      });
  
      alert(response.data.message);
      // Update UI: Move complaint to dismissed list
      setComplaints(prev => prev.filter(c => c.id !== complaintId));
      setDismissedComplaints(prev => [...prev, { ...response.data, id: complaintId }]);
  
    } catch (error) {
      console.error("Error during dismissal:", error.response?.data || error.message);
      alert("Failed to dismiss complaint.");
    }
  };

  // New functions for notification feature
  const handleOpenNotifyDialog = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setMessage('');
    setErrorMessage('');
    setSuccessMessage('');
    setOpenNotifyDialog(true);
  };

  const handleCloseNotifyDialog = () => {
    setOpenNotifyDialog(false);
    setSelectedComplaintId(null);
    setMessage('');
    setErrorMessage('');
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Using the provided SMS notification function format
  const sendSMSNotification = async () => {
    if (!selectedComplaintId || !message) {
      setErrorMessage("Missing complaintId or message");
      return;
    }
    
    setIsProcessing(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notify-complainant/${selectedComplaintId}`,
        { message }
      );
      
      if (response.data?.success) {
        setSuccessMessage("SMS sent successfully!");
        setOpenNotifyDialog(false);
      } else {
        setErrorMessage(`Failed to send SMS: ${response.data?.message}`);
      }
    } catch (error) {
      setErrorMessage(`Error sending SMS: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear messages when dialog closes
  useEffect(() => {
    if (!openNotifyDialog) {
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 300);
    }
  }, [openNotifyDialog]);

  return (
    <div>
      {/* Header/AppBar with City Logo */}
      <AppBar position="static" sx={{ backgroundColor: '#004165' }}>
        <Toolbar sx={{ padding: isMobile ? '0 8px' : '0 24px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/cityseal1.png" 
              alt="Sorsogon Logo" 
              style={{ height: isMobile ? '30px' : '40px', marginRight: '12px' }} 
            />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              component="div" 
              sx={{ 
                flexGrow: 1,
                display: { xs: isMobile ? 'none' : 'block', sm: 'block' }
              }}
            >
              {isMobile ? "Assigned Complaints" : "Assigned Complaints for SK Personnel"}
            </Typography>
          </Box>
          
          {isMobile ? (
            <>
              <Box sx={{ marginLeft: 'auto' }}>
                <IconButton 
                  color="inherit" 
                  aria-label="menu" 
                  aria-controls="user-menu" 
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  {userData.fullname  || 'SK Personnel'}
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ marginRight: 2 }}>
                {fullname || 'SK Personnel'}
              </Typography>
              <IconButton color="inherit">
                <AccountCircle />
              </IconButton>
              <Button 
                onClick={handleLogout} 
                color="inherit" 
                startIcon={<ExitToApp />}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Background Image with Overlay */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: -1,
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 65, 101, 0.8)',
        }
      }}>
        <Box 
          component="img" 
          src="/images/citystreet.jpg" 
          alt="Sorsogon City"
          sx={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          paddingTop: { xs: 2, sm: 3, md: 4 }, 
          paddingBottom: 4, 
          position: 'relative',
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            color: 'white', 
            marginBottom: { xs: 2, sm: 3 }, 
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}
          aria-label="City of Sorsogon"
        >
          CITY OF SORSOGON
        </Typography>
        
        <Grid container spacing={isMobile ? 2 : 3}>
          {complaints.map(complaint => (
            <Grid item xs={12} sm={6} md={4} key={complaint.id}>
              <Card 
                elevation={6}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  borderRadius: { xs: '8px', sm: '12px' }, 
                  overflow: 'hidden',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: '#004165' }} aria-label={`Complaint ${complaint.id}`}>
                      {complaint.id}
                    </Avatar>
                  }
                  title={
                    <Typography variant={isMobile ? "subtitle1" : "h6"}>
                      Complaint #{complaint.id}
                    </Typography>
                  }
                  subheader={
                    <Chip 
                      label={complaint.category} 
                      size="small" 
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  }
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    padding: isMobile ? '12px 16px' : '16px'
                  }}
                />
                
                <CardContent sx={{ 
                  flexGrow: 1,
                  padding: isMobile ? '12px 16px' : '16px'
                }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 1,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <AccountCircle sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: '#555', mt: '2px' }} />
                      <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>Name:</Box> {complaint.fullName}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 1,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <Phone sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: '#555', mt: '2px' }} />
                      <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>Contact:</Box> {complaint.contactNumber}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 1,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <DateRange sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: '#555', mt: '2px' }} />
                      <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>Date/Time:</Box> {complaint.incident_datetime}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start',
                      mb: 1,
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      flexWrap: 'wrap'
                    }}>
                      <LocationOn sx={{ mr: 1, fontSize: isMobile ? 18 : 20, color: '#555', mt: '2px' }} />
                      <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>Location:</Box> {complaint.location}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant={isMobile ? "body2" : "body1"} 
                    color="text.primary" 
                    paragraph
                    sx={{ wordBreak: 'break-word' }}
                  >
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Details:</Box> {complaint.complaintDetails}
                  </Typography>
                  
                  <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 1 }}>
                    <Box component="span" sx={{ fontWeight: 'bold' }}>Franchise Plate #:</Box> {complaint.franchise_plate_no}
                  </Typography>

                  {complaint.driver_info && (() => {
                    let driverInfo;
                    try {
                      driverInfo = JSON.parse(complaint.driver_info);
                    } catch (error) {
                      console.error("Error parsing driver_info:", error);
                      driverInfo = null;
                    }

                    return driverInfo ? (
                      <Box sx={{ 
                        mt: 2, 
                        p: 1.5, 
                        bgcolor: '#f9f9f9', 
                        borderRadius: 1, 
                        border: '1px solid #eee',
                        fontSize: isMobile ? '0.875rem' : '1rem'
                      }}>
                        <Typography 
                          variant={isMobile ? "subtitle2" : "subtitle1"} 
                          color="primary" 
                          fontWeight="bold" 
                          sx={{ mb: 1 }}
                        >
                          Tricycle Driver Details
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Name:</Box> {driverInfo.driver_name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Association:</Box> {driverInfo.association}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          <Box component="span" sx={{ fontWeight: 'bold' }}>Address:</Box> {driverInfo.address}
                        </Typography>
                      </Box>
                    ) : null;
                  })()}

                  {extractedText && selectedComplaintId === complaint.id && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#e1f5fe', borderRadius: 1 }}>
                      <Typography variant="body2" color="primary">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>Extracted Ticket #:</Box> {extractedText}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography 
                    variant={isMobile ? "subtitle2" : "subtitle1"} 
                    fontWeight="bold" 
                    color="primary" 
                    sx={{ mb: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <Camera sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                    Upload Ticket Image
                  </Typography>
                  
                  <Box>
                    <input
                      id={`file-upload-${complaint.id}`}
                      accept="image/*"
                      type="file"
                      capture="camera"
                      onChange={(e) => handleImageChange(e, complaint.id)}
                      style={{ 
                        marginBottom: '10px',
                        width: '100%',
                        fontSize: isMobile ? '0.8rem' : '1rem'
                      }}
                      aria-label="Upload ticket image"
                    />
                    <label htmlFor={`file-upload-${complaint.id}`} aria-hidden="true">
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', mb: 1 }}
                      >
                        Select or take a photo of the ticket
                      </Typography>
                    </label>
                  </Box>
                  
                  {image && selectedComplaintId === complaint.id && (
                    <Box sx={{ 
                      mt: 1, 
                      mb: 2, 
                      border: '1px solid #ddd', 
                      borderRadius: 1, 
                      overflow: 'hidden' 
                    }}>
                      <img 
                        src={URL.createObjectURL(image)} 
                        alt="Ticket Preview" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '150px', 
                          objectFit: 'cover' 
                        }} 
                      />
                    </Box>
                  )}

                  {/* Action Buttons - Now with Notify button */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0,
                    justifyContent: 'space-between', 
                    mt: 2 
                  }}>
                    {/* Only show the Resolve button when an image is uploaded for this complaint */}
                    {image && selectedComplaintId === complaint.id && (
                      <Button 
                        variant="contained" 
                        color="success" 
                        startIcon={<CheckCircle />}
                        onClick={() => resolveComplaint(complaint.id, id)}
                        disabled={isProcessing}
                        sx={{ 
                          flex: 1, 
                          mr: isMobile ? 0 : 1,
                          py: isMobile ? 1 : 'initial',
                          mb: isMobile ? 1 : 0
                        }}
                        aria-label={`Resolve complaint ${complaint.id}`}
                      >
                        {isProcessing ? "Processing..." : "Resolve"}
                      </Button>
                    )}
                    
                    {/* Add the Notify button */}
                    <Button
                      variant="contained"
                      color="info"
                      startIcon={<Notifications />}
                      onClick={() => handleOpenNotifyDialog(complaint.id)}
                      disabled={isProcessing}
                      sx={{ 
                        flex: 1,
                        mx: isMobile ? 0 : 1,
                        py: isMobile ? 1 : 'initial',
                        mb: isMobile ? 1 : 0
                      }}
                      aria-label={`Notify complainant ${complaint.id}`}
                    >
                      Notify
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      color="error" 
                      startIcon={<Cancel />}
                      onClick={() => dismissComplaint(complaint.id, id)}
                      disabled={isProcessing}
                      sx={{ 
                        flex: 1, 
                        ml: isMobile ? 0 : 1,
                        py: isMobile ? 1 : 'initial'
                      }}
                      aria-label={`Dismiss complaint ${complaint.id}`}
                    >
                      Dismiss
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {complaints.length === 0 && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              mt: 3, 
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            <Info color="info" sx={{ fontSize: { xs: 40, sm: 60 }, mb: 2, opacity: 0.7 }} />
            <Typography variant={isMobile ? "h6" : "h5"}>
              No complaints assigned to you at the moment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New complaints will appear here when they are assigned to you
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Notification Dialog */}
      <Dialog 
        open={openNotifyDialog} 
        onClose={handleCloseNotifyDialog}
        fullWidth
        maxWidth="sm"
        aria-labelledby="notification-dialog-title"
      >
        <DialogTitle id="notification-dialog-title">
          Send SMS Notification to Complainant
        </DialogTitle>
        <DialogContent>
          {/* Error message display */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          
          {/* Success message display */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            id="notification-message"
            label="SMS Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
            placeholder="Enter status update or information to share with the complainant"
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            This message will be sent as an SMS to the complainant&apos;s contact number.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotifyDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={sendSMSNotification} 
            color="primary" 
            variant="contained" 
            startIcon={<Send />}
            disabled={isProcessing || !message.trim()}
          >
            {isProcessing ? "Sending..." : "Send SMS"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SKPersonelForm;