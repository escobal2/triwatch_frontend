import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import API_BASE_URL from '@/config/apiConfig';

const ArchivedComplaints = () => {
    const [archivedComplaints, setArchivedComplaints] = useState([]);

    useEffect(() => {
        const fetchArchivedComplaints = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/archived-complaints`);
                setArchivedComplaints(response.data.archived_complaints);
            } catch (error) {
                console.error("Error fetching archived complaints:", error);
            }
        };

        fetchArchivedComplaints();
    }, []);

    return (
        <Grid container spacing={3}>
            {archivedComplaints.length === 0 ? (
                <Typography variant="body1" sx={{ marginTop: 3 }}>
                    No archived complaints found.
                </Typography>
            ) : (
                archivedComplaints.map((complaint) => (
                    <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="#FF6A00" gutterBottom><strong>Complaint {complaint.id}</strong></Typography>
                                <Typography variant="body2"><strong>Name: </strong>{complaint.fullname}</Typography>
                                <Typography variant="body2"><strong>Contact Number: </strong>{complaint.contactnum}</Typography>
                                <Typography variant="body2"><strong>Catergory: </strong>{complaint.category}</Typography>
                                <Typography variant="body2"><strong>Date: </strong>{complaint.date}</Typography>
                                <Typography variant="body2"><strong>Details: </strong>{complaint.details}</Typography>
                                <Typography variant="body2"><strong>Assigned To: </strong>{complaint.assigned_to_name}</Typography>
                                {complaint.file_url && <a href={complaint.file_url}>View File</a>}
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default ArchivedComplaints;
