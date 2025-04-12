import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, CardContent, Typography, Button, Grid, Box, Divider, 
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Snackbar, Alert 
} from '@mui/material';
import { NotificationsActive as NotificationsIcon, Archive as ArchiveIcon } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

// Helper function to format datetime (assumed from the second snippet)
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'Not provided';
  const date = new Date(dateTimeString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const EmergencyComplaints = () => {
    const [emergencyComplaints, setEmergencyComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    
    // Check for small mobile screens
    const [isSmallMobile, setIsSmallMobile] = useState(false);
    
    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallMobile(window.innerWidth < 400);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    
    // Dialog states
    const [dialogState, setDialogState] = useState({
        smsDialog: {
            open: false,
            complaintId: null,
            message: ''
        },
        archiveDialog: {
            open: false,
            complaintId: null
        }
    });

    const fetchEmergencyComplaints = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/emergencycomplaints`);
            setEmergencyComplaints(response.data.retrieved_data);
        } catch (error) {
            console.error("Error fetching emergency complaints:", error);
            showNotification("Failed to load emergency complaints", "error");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEmergencyComplaints();
        const interval = setInterval(fetchEmergencyComplaints, 10000); // Polling every 10 seconds
        return () => clearInterval(interval);
    }, [fetchEmergencyComplaints]);

    // Notification handler
    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Action handlers
    const handleAction = {
        notify: (complaintId) => {
            setDialogState(prev => ({
                ...prev,
                smsDialog: {
                    open: true,
                    complaintId,
                    message: ''
                }
            }));
        },
        archive: (complaintId) => {
            setDialogState(prev => ({
                ...prev,
                archiveDialog: {
                    open: true,
                    complaintId
                }
            }));
        }
    };

    // SMS Dialog handlers
    const closeSmsDialog = () => {
        setDialogState(prev => ({
            ...prev,
            smsDialog: {
                ...prev.smsDialog,
                open: false
            }
        }));
    };

    const handleSmsMessageChange = (event) => {
        setDialogState(prev => ({
            ...prev,
            smsDialog: {
                ...prev.smsDialog,
                message: event.target.value
            }
        }));
    };

    const sendSmsNotification = async () => {
        const { complaintId, message } = dialogState.smsDialog;
        
        if (!complaintId || !message.trim()) {
            showNotification("Please enter a message", "error");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/notify-emergency-complainant/${complaintId}`,
                { message }
            );
            
            if (response.data?.message === 'Notification sent successfully!') {
                showNotification("SMS notification sent successfully");
                closeSmsDialog();
            } else {
                showNotification("Failed to send SMS notification", "error");
            }
        } catch (error) {
            console.error("Error sending SMS:", error);
            showNotification(`Error sending SMS: ${error.response?.data?.message || error.message}`, "error");
        }
    };

    // Archive Dialog handlers
    const closeArchiveDialog = () => {
        setDialogState(prev => ({
            ...prev,
            archiveDialog: {
                ...prev.archiveDialog,
                open: false
            }
        }));
    };

    const handleArchiveComplaint = async () => {
        const { complaintId } = dialogState.archiveDialog;
        
        try {
            const response = await axios.post(`${API_BASE_URL}/archive-emergency-complaint/${complaintId}`);
            
            if (response.status === 200) {
                showNotification("Complaint successfully archived");
                fetchEmergencyComplaints();
            } else {
                showNotification("Error archiving complaint", "error");
            }
        } catch (error) {
            console.error("Error archiving complaint:", error);
            showNotification("Error archiving complaint. Please try again.", "error");
        } finally {
            closeArchiveDialog();
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            
            <Grid container spacing={2}>
                {emergencyComplaints.length === 0 ? (
                    <Grid item xs={12}>
                        <Card sx={{ backgroundColor: '#f5f5f5' }}>
                            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="body1">
                                    No emergency complaints found.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    emergencyComplaints.map((complaint) => (
                        <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                            <Card sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                                borderRadius: '12px',
                                overflow: 'hidden',
                                minWidth: 0 // Important for flex items to allow shrinking below content size
                            }}>
                                {/* Card Header - Emergency style with red background */}
                                <Box sx={{ 
                                    bgcolor: '#d32f2f', // Emergency red color
                                    color: 'white', 
                                    py: { xs: 0.5, sm: 0.75 }, 
                                    px: { xs: 1, sm: 1.5 },
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Typography noWrap variant="subtitle1" fontWeight="bold" sx={{ 
                                        fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } 
                                    }}>
                                        Emergency #{complaint.id}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        sx={{ 
                                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            px: 1,
                                            py: 0.25,
                                            ml: 0.5,
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        URGENT
                                    </Typography>
                                </Box>
                            
                                <CardContent sx={{ 
                                    flexGrow: 1, 
                                    p: 0, 
                                    "&:last-child": { pb: 0 }, // Remove default padding at bottom
                                    overflowY: 'auto' // Allow scrolling if content is too large
                                }}>
                                    {/* Complainant Information */}
                                    <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                                        <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                            mb: 0.5
                                        }}>
                                            Complainant
                                        </Typography>
                                        
                                        <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Name:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium" 
                                                        sx={{ 
                                                            wordBreak: 'break-word',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        {complaint.fullName}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Contact:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium" 
                                                        sx={{ 
                                                            wordBreak: 'break-word',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        {complaint.contactNumber || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    <Divider />
                                    
                                    {/* Incident Details */}
                                    <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                                        <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                            mb: 0.5
                                        }}>
                                            Incident Details
                                        </Typography>
                                        
                                        <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            <Grid item xs={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Type:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium"
                                                        sx={{
                                                            bgcolor: 
                                                                complaint.category === 'Assault' ? '#ffcdd2' : 
                                                                complaint.category === 'Overcharging' ? '#c8e6c9' : 
                                                                complaint.category === 'Lost Belonging' ? '#bbdefb' : '#e1f5fe',
                                                            px: 0.5,
                                                            py: 0.2,
                                                            borderRadius: '4px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: '100%'
                                                        }}
                                                    >
                                                        {complaint.category}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Date:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium" 
                                                        sx={{ 
                                                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis'
                                                        }}
                                                    >
                                                        {formatDateTime(complaint.incident_datetime)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Location:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium" 
                                                        sx={{ 
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            width: '100%'
                                                        }}
                                                    >
                                                        {complaint.location}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            
                                            <Grid item xs={12}>
                                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                                    Details:
                                                </Typography>
                                                <Box sx={{ 
                                                    bgcolor: '#f5f5f5', 
                                                    p: 1, 
                                                    borderRadius: '4px', 
                                                    maxHeight: { xs: '40px', sm: '50px', md: '60px' }, 
                                                    overflow: 'auto',
                                                    border: '1px solid #e0e0e0',
                                                    fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                                }}>
                                                    <Typography 
                                                        variant="caption" 
                                                        component="div"
                                                        sx={{ wordBreak: 'break-word' }}
                                                    >
                                                        {complaint.complaintDetails}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    <Divider />
                                    
                                    {/* Vehicle Information */}
                                    <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
                                        <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                                            fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                            mb: 0.5
                                        }}>
                                            Vehicle Info
                                        </Typography>
                                        
                                        <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                                            <Grid item xs={12}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ 
                                                        minWidth: { xs: '40px', sm: '50px' },
                                                        flexShrink: 0,
                                                        pt: 0.1
                                                    }}>
                                                        Plate:
                                                    </Typography>
                                                    <Typography 
                                                        variant="caption" 
                                                        fontWeight="medium" 
                                                        sx={{ 
                                                            fontFamily: 'monospace',
                                                            letterSpacing: '0.5px'
                                                        }}
                                                    >
                                                        {complaint.franchise_plate_no || 'Not provided'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                    
                                    {/* Action buttons - optimized for space */}
                                    <Box sx={{ 
                                        p: { xs: 0.5, sm: 1 },
                                        display: 'flex', 
                                        gap: 0.5,
                                        justifyContent: 'space-between',
                                        bgcolor: '#f5f5f5'
                                    }}>
                                        <Button
                                            startIcon={<NotificationsIcon sx={{ fontSize: '0.9rem' }} />}
                                            onClick={() => handleAction.notify(complaint.id)}
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#fcdf03',
                                                color: '#000000',
                                                borderRadius: '16px',
                                                '&:hover': { backgroundColor: '#e6cc00' },
                                                flexGrow: 1,
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                py: { xs: 0.5, sm: 0.75 },
                                                px: { xs: 0.5, sm: 1 },
                                                minWidth: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {!isSmallMobile ? 'Notify' : ''}
                                        </Button>
                                        
                                        <Button
                                            startIcon={<ArchiveIcon sx={{ fontSize: '0.9rem' }} />}
                                            onClick={() => handleAction.archive(complaint.id)}
                                            variant="contained"
                                            size="small"
                                            sx={{
                                                backgroundColor: '#0384fc',
                                                borderRadius: '16px',
                                                '&:hover': { backgroundColor: '#0366d6' },
                                                flexGrow: 1,
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                py: { xs: 0.5, sm: 0.75 },
                                                px: { xs: 0.5, sm: 1 },
                                                minWidth: 0,
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {!isSmallMobile ? 'Archive' : ''}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* SMS Notification Dialog */}
            <Dialog 
                open={dialogState.smsDialog.open} 
                onClose={closeSmsDialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Send SMS Notification</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Message"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={dialogState.smsDialog.message}
                        onChange={handleSmsMessageChange}
                        placeholder="Enter your notification message here..."
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeSmsDialog} color="inherit">
                        Cancel
                    </Button>
                    <Button 
                        onClick={sendSmsNotification} 
                        variant="contained" 
                        color="primary"
                        disabled={!dialogState.smsDialog.message.trim()}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Archive Confirmation Dialog */}
            <Dialog 
                open={dialogState.archiveDialog.open} 
                onClose={closeArchiveDialog}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Confirm Archive</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to archive this emergency complaint? 
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={closeArchiveDialog} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleArchiveComplaint} 
                        variant="contained" 
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={closeNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={closeNotification} 
                    severity={notification.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EmergencyComplaints;