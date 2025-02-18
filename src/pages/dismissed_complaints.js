import { useEffect, useState, useCallback } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, Divider, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const DismissedComplaints = () => {
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // Default to daily timeframe
  const [includeArchived, setIncludeArchived] = useState(false); // Toggle archived data

  // Date formatting function
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Fetch dismissed complaints (including archived)
  const fetchDismissedComplaints = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dismissed-reports`, {
        params: {
          timeframe: timeframe,
          include_archived: includeArchived, // Fetch archived complaints if enabled
        },
      });

      console.log('Fetched Dismissed Complaints:', response.data.dismissed_complaints);
      setDismissedComplaints(response.data.dismissed_complaints);
    } catch (error) {
      console.error('Error fetching dismissed complaints:', error);
      setErrorMessage('Failed to fetch dismissed complaints.');
    } finally {
      setLoadingReports(false);
    }
  }, [timeframe, includeArchived]);

  useEffect(() => {
    fetchDismissedComplaints();
    const interval = setInterval(() => fetchDismissedComplaints(), 2000);
    return () => clearInterval(interval);
  }, [fetchDismissedComplaints]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        ❌ Dismissed Complaints (Active & Archived)
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

      {/* Timeframe & Archive Toggle */}
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
            Loading dismissed complaints...
          </Typography>
        ) : (
          dismissedComplaints.length > 0 ? (
            dismissedComplaints.map((complaint) => {
              const driverInfo = complaint.driver_info ? JSON.parse(complaint.driver_info) : {};
              const isArchived = complaint.archived_at !== null; // Check if complaint is archived

              return (
                <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 3,
                      borderRadius: 2,
                      backgroundColor: isArchived ? '#f5f5f5' : 'white', // Grey background for archived complaints
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Complaint ID: {complaint.id} {isArchived}
                      </Typography>
                      <Typography paragraph>
                        <strong>Dismissed Reason:</strong> {complaint.dismiss_reason}
                      </Typography>
                      <Typography paragraph>
                        <strong>Dismissed By:</strong> {complaint.dismissed_by_name}
                      </Typography>
                      <Typography paragraph>
                        <strong>Dismissed At:</strong> {formatDateTime(complaint.dismissed_at)}
                      </Typography>
                      <Typography paragraph>
                        <strong>Franchise Plate Number:</strong> {complaint.franchise_plate_no}
                      </Typography>

                      {/* Driver Information */}
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
              No dismissed complaints available for this timeframe.
            </Typography>
          )
        )}
      </Grid>
    </Container>
  );
};

export default DismissedComplaints;
