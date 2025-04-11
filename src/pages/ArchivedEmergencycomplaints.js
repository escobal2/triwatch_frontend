import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import API_BASE_URL from '@/config/apiConfig';

const ArchivedEmergencyComplaints = () => {
    const [archivedComplaints, setArchivedComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArchivedComplaints = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/archived-emergency-complaints`);
                console.log(response.data); // Log the response data
                if (response.data.archived_emergency_complaints) {
                    setArchivedComplaints(response.data.archived_emergency_complaints);
                } else {
                    setError('No data found. Please check the API response structure.');
                }
            } catch (error) {
                console.error("Error fetching archived complaints:", error);
                setError('Failed to fetch archived complaints. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedComplaints();
    }, []);

    return (
        <Grid container spacing={3}>
        {archivedComplaints.length === 0 ? (
            <Typography variant="body1" sx={{ marginTop: 3 }}>
                No archived Emergency Complaints found.
            </Typography>
        ) : (
            archivedComplaints.map((complaint) => (
                <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" color="#FF6A00" gutterBottom><strong>Complaint {complaint.id}</strong></Typography>
                            <Typography variant="body2"><strong>Name: </strong>{complaint.fullName}</Typography>
                            <Typography variant="body2"><strong>Contact Number: </strong>{complaint.contactNumber}</Typography>
                            <Typography variant="body2"><strong>Catergory: </strong>{complaint.category}</Typography>
                            <Typography variant="body2"><strong>Date: </strong>{complaint.incident_datetime}</Typography>
                            <Typography variant="body2"><strong>Details: </strong>{complaint.complaintDetails}</Typography>
                            {complaint.file_url && <a href={complaint.file_url}>View File</a>}
                        </CardContent>
                    </Card>
                </Grid>
            ))
        )}
    </Grid>
    );
};

export default ArchivedEmergencyComplaints;
