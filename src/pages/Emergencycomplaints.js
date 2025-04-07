import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, CardContent, Typography, Button, Grid, Box, Divider, 
  CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Snackbar, Alert 
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import API_BASE_URL from '@/config/apiConfig';

const EmergencyComplaints = () => {
    const [emergencyComplaints, setEmergencyComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    
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
        const interval = setInterval(fetchEmergencyComplaints, 10000); // Polling every 10 seconds instead of 2
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

    // SMS Dialog handlers
    const openSmsDialog = (complaintId) => {
        setDialogState(prev => ({
            ...prev,
            smsDialog: {
                open: true,
                complaintId,
                message: ''
            }
        }));
    };

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
    const openArchiveDialog = (complaintId) => {
        setDialogState(prev => ({
            ...prev,
            archiveDialog: {
                open: true,
                complaintId
            }
        }));
    };

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
            <Typography variant="h5" component="h1" gutterBottom>
                Emergency Complaints
            </Typography>
            
            <Grid container spacing={3}>
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
                            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" color="error" gutterBottom>
                                        <strong>Emergency Complaint #{complaint.id}</strong>
                                    </Typography>
                                    <Divider sx={{ marginBottom: 2 }} />
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body1"><strong>Name:</strong> {complaint.fullName}</Typography>
                                        <Typography variant="body1"><strong>Contact:</strong> {complaint.contactNumber}</Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Category:</strong> {complaint.category}</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Incident Date:</strong> {complaint.incident_datetime}</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Location:</strong> {complaint.location}</Typography>
                                    <Typography variant="body2" sx={{ mb: 1 }}><strong>Franchise Plate:</strong> {complaint.franchise_plate_no}</Typography>
                                    
                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}><strong>Details:</strong></Typography>
                                    <Typography variant="body2" sx={{ 
                                        backgroundColor: '#f8f8f8', 
                                        p: 1.5, 
                                        borderRadius: 1,
                                        maxHeight: '100px',
                                        overflow: 'auto'
                                    }}>
                                        {complaint.complaintDetails}
                                    </Typography>
                                </CardContent>
                                
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                    <Button
                                        onClick={() => openSmsDialog(complaint.id)}
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: '#fcdf03', 
                                            color: '#000',
                                            borderRadius: '20px', 
                                            px: 2,
                                            '&:hover': { backgroundColor: '#e6cc03' } 
                                        }}
                                    >
                                        Notify
                                    </Button>
                                    <Button
                                        onClick={() => openArchiveDialog(complaint.id)}
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: '#0384fc', 
                                            borderRadius: '20px', 
                                            px: 2,
                                            '&:hover': { backgroundColor: '#0270d7' } 
                                        }}
                                    >
                                        Archive
                                    </Button>
                                </Box>
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