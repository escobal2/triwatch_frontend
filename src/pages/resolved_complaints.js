import { useEffect, useState, useCallback } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, Divider, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const ResolvedComplaints = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // Default to daily timeframe

  // Date formatting function
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    return date.toLocaleString(undefined, options);
  };

  // Fetch resolved complaints including archived ones
  const fetchResolvedComplaints = useCallback(async (timeframe) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resolved-reports`, {
        params: {
          timeframe: timeframe, // Pass timeframe parameter to filter data
          include_archived: true, // Include archived complaints
        },
      });

      console.log('Fetched Resolved Complaints:', response.data.resolved_complaints);

      setResolvedComplaints(response.data.resolved_complaints);
    } catch (error) {
      console.error('Error fetching resolved complaints:', error);
      setErrorMessage('Failed to fetch resolved complaints.');
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    fetchResolvedComplaints(timeframe);
    const interval = setInterval(() => fetchResolvedComplaints(timeframe), 5000);
    return () => clearInterval(interval);
  }, [fetchResolvedComplaints, timeframe]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Resolved Complaints (Including Archived)
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {['daily', 'weekly', 'monthly'].map((time) => (
            <Button
              key={time}
              variant={timeframe === time ? 'contained' : 'outlined'}
              onClick={() => setTimeframe(time)}
              sx={{ marginRight: 2 }}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </Button>
          ))}
        </Grid>

        {loadingReports ? (
          <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', marginTop: 3 }}>
            Loading resolved complaints...
          </Typography>
        ) : (
          resolvedComplaints.length > 0 ? (
            resolvedComplaints.map((complaint) => {
              const driverInfo = complaint.driver_info ? JSON.parse(complaint.driver_info) : {};
              return (
                <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      backgroundColor: 'white',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Complaint ID: {complaint.id}
                      </Typography>
                      <Typography paragraph>
                        <strong>Resolved By:</strong> {complaint.resolved_by_name}
                      </Typography>
                      <Typography paragraph>
                        <strong>Resolved At:</strong> {formatDateTime(complaint.resolved_at)}
                      </Typography>
                      <Typography paragraph>
                        <strong>Resolution:</strong> {complaint.resolution}
                      </Typography>
                      <Typography paragraph>
                        <strong>Franchise Plate Number:</strong> {complaint.franchise_plate_no}
                      </Typography>

                      {driverInfo.driver_name && (
                        <>
                          <Divider sx={{ marginY: 2 }} />
                          <Typography variant="subtitle1">🚖 Driver Information</Typography>
                          <Typography paragraph>
                            <strong>Name:</strong> {driverInfo.driver_name}
                          </Typography>
                          <Typography paragraph>
                            <strong>Association:</strong> {driverInfo.association}
                          </Typography>
                          <Typography paragraph>
                            <strong>Address:</strong> {driverInfo.address}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', marginTop: 3 }}>
              No resolved complaints available for this timeframe.
            </Typography>
          )
        )}
      </Grid>
    </Container>
  );
};

export default ResolvedComplaints;
