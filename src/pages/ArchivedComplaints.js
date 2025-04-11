import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import API_BASE_URL from '@/config/apiConfig';

const ArchivedComplaints = ({ searchTerm = '' }) => {
    const [archivedComplaints, setArchivedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch archived complaints
    useEffect(() => {
        const fetchArchivedComplaints = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/archived-complaints`);
                setArchivedComplaints(response.data.archived_complaints || []);
            } catch (error) {
                console.error("Error fetching archived complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedComplaints();
    }, []);

    // Filter complaints based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredComplaints(archivedComplaints);
            return;
        }
        
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = archivedComplaints.filter(complaint => 
            complaint.fullName?.toLowerCase().includes(searchTermLower) ||
            complaint.contactNumber?.toLowerCase().includes(searchTermLower) ||
            complaint.category?.toLowerCase().includes(searchTermLower) ||
            complaint.complaintDetails?.toLowerCase().includes(searchTermLower) ||
            complaint.id?.toString().includes(searchTermLower)
        );
        
        setFilteredComplaints(filtered);
    }, [searchTerm, archivedComplaints]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress sx={{ color: '#3a86a8' }} />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {filteredComplaints.length === 0 ? (
                <Grid item xs={12}>
                    <Box textAlign="center" mt={4} p={3} bgcolor="white" borderRadius={2}>
                        <Typography variant="body1" color="text.secondary">
                            {searchTerm ? "No archived complaints match your search criteria" : "No archived complaints found"}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                filteredComplaints.map((complaint) => (
                    <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="#FF6A00" gutterBottom><strong>Complaint {complaint.id}</strong></Typography>
                                <Typography variant="body2"><strong>Name: </strong>{complaint.fullName}</Typography>
                                <Typography variant="body2"><strong>Contact Number: </strong>{complaint.contactNumber}</Typography>
                                <Typography variant="body2"><strong>Category: </strong>{complaint.category}</Typography>
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

export default ArchivedComplaints;