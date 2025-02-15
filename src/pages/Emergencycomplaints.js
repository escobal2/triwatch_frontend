import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Divider, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import API_BASE_URL from '@/config/apiConfig';

const EmergencyComplaints = () => {
    const [emergencyComplaints, setEmergencyComplaints] = useState([]);
    const [successMessageArchive, setSuccessMessageArchive] = useState(null);   
    const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
    const [successMessageSMS, setSuccessMessageSMS] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState("");
    const [complaintId, setComplaintId] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);

    const fetchEmergencyComplaints = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/emergencycomplaints`);
            setEmergencyComplaints(response.data.retrieved_data);
        } catch (error) {
            console.error("Error fetching emergency complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmergencyComplaints();
        const interval = setInterval(()=>{
            fetchEmergencyComplaints();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const confirmArchiveComplaint = (complaintId) => {
        setSuccessMessage(null);
        setSelectedComplaintId(complaintId);
        setOpenArchiveDialog(true); // Open confirmation dialog
    };

    const handleNotifyClick = (id) => {
        setComplaintId(id); // Set the complaintId when Notify button is clicked
        setOpenDialog(true); // Open the dialog
    };

    const closeNotification = () => {
        setSuccessMessageArchive(null);
        setSuccessMessageSMS(null);
    };

    const sendSMSNotification = async () => {
        if (complaintId && message) {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/notify-emergency-complainant/${complaintId}`,
                    { message }
                );
                if (response.data?.message === 'Notification sent successfully!') {
                    console.log("SMS sent successfully!");
                    setSuccessMessageSMS("SMS sent successfully!");
                    setOpenDialog(false); // Close the dialog after success
                } else {
                    console.error("Failed to send SMS:", response.data.message);
                    setSuccessMessageSMS("Failed to send SMS");
                }
            } catch (error) {
                console.error("Error sending SMS:", error.response?.data || error.message);
                setSuccessMessageSMS("Error sending SMS");
            }
        } else {
            console.error("Missing complaintId or message");
            setSuccessMessageSMS("Missing complaintId or message");
        }
    };

    const handleArchiveComplaint = async (complaintId) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/archive-emergency-complaint/${complaintId}`);
            if (response.status === 200) {
                setSuccessMessageArchive("Complaint successfully archived.");
                setErrorMessage(null);
                // Refresh the complaints list after archiving
                fetchReports();
                fetchArchivedComplaints();
            } else {
                setErrorMessage("Error archiving complaint.");
            }
        } catch (error) {
            console.error("Error archiving complaint:", error);
            setErrorMessage("Error archiving complaint. Please try again.");
        } finally {
            setOpenArchiveDialog(false); // Close confirmation dialog
        }
    };

    return (
        <Grid container spacing={3}>
            {emergencyComplaints.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: 3 }}>
                    No emergency complaints found.
                </Typography>
            ) : (
                emergencyComplaints.map((complaint) => (
                    <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="#FF6A00" gutterBottom>
                                    <strong>Emergency Complaint {complaint.id}</strong>
                                </Typography>
                                <Divider sx={{ marginBottom: 1 }} />
                                <Typography><strong>Name:</strong> {complaint.fullName}</Typography>
                                <Typography><strong>Contact Number:</strong> {complaint.contactNumber}</Typography>
                                <Typography><strong>Category:</strong> {complaint.category}</Typography>
                                <Typography><strong>Incident Date and Time:</strong> {complaint.incident_datetime}</Typography>
                                <Typography><strong>Location:</strong> {complaint.location}</Typography>
                                <Typography><strong>Details:</strong> {complaint.complaintDetails}</Typography>
                                <Typography><strong>Franchise Plate Number:</strong> {complaint.franchise_plate_no}</Typography>
                                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                            variant="contained"
                                            onClick={() => handleNotifyClick(complaint.id)}
                                            sx={{ backgroundColor: '#fcdf03', borderRadius: '20px', padding: '3px 10px', '&:hover': { backgroundColor: '#fcdf03' } }}
                                        >
                                            Notify
                                        </Button>
                                     <Button
                                            onClick={() => confirmArchiveComplaint(complaint.id)} // Call confirmArchiveComplaint here
                                            variant="contained"
                                            sx={{ backgroundColor: '#0384fc', borderRadius: '20px', padding: '5px 15px', '&:hover': { backgroundColor: '#0384fc' } }}
                                        >
                                            Archive
                                        </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}

              {/* Dialog for sending notifications */}
              <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Send Notification</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            Cancel
        </Button>
        <Button onClick={sendSMSNotification} color="primary">
            Send
        </Button>
    </DialogActions>
</Dialog>

                             {/* Dialog for sending notifications */}
                             <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Send Notification</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            Cancel
        </Button>
        <Button onClick={sendSMSNotification} color="primary">
            Send
        </Button>
    </DialogActions>
</Dialog>

             {/* Archive Complaint Dialog */}
<Dialog open={openArchiveDialog} onClose={() => setOpenArchiveDialog(false)}>
    <DialogTitle>Confirm Archive</DialogTitle>
    <DialogContent>
        <Typography>Are you sure you want to archive this complaint?</Typography>
        {successMessageArchive && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
                {successMessageArchive}
            </Alert>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenArchiveDialog(false)} color="secondary">Cancel</Button>
        <Button onClick={() => handleArchiveComplaint(selectedComplaintId)} color="primary">Confirm</Button>
    </DialogActions>
</Dialog>
<Snackbar
                open={!!successMessageArchive || !!successMessageSMS }
                autoHideDuration={4000}
                onClose={closeNotification}
                message={successMessageArchive || successMessageSMS}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Grid>
    );
};

export default EmergencyComplaints;
