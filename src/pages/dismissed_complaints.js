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

  // Fetch dismissed complaints function
  const fetchDismissedComplaints = useCallback(async (timeframe) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dismissed-reports`, {
        params: {
          timeframe: timeframe, // Pass timeframe parameter to filter data
        },
      });

      console.log('Fetched Dismissed Complaints:', response.data.dismissed_complaints); // Log the entire response

      setDismissedComplaints(response.data.dismissed_complaints);
    } catch (error) {
      console.error('Error fetching dismissed complaints:', error);
      setErrorMessage('Failed to fetch dismissed complaints.');
    } finally {
      setLoadingReports(false);
    }
  }, []);

 useEffect(() => {
    fetchDismissedComplaints(timeframe); // ✅ Pass timeframe when fetching
    const interval = setInterval(() => fetchDismissedComplaints(timeframe), 2000); // ✅ Refresh with new timeframe
    return () => clearInterval(interval);
  }, [fetchDismissedComplaints, timeframe]); // ✅ Add timeframe as dependency

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        ❌ Dismissed Complaints
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
        {/* Timeframe Filter */}
        <Grid item xs={12}>
          {['daily', 'weekly', 'monthly'].map((time) => (
            <Button
              key={time}
              variant={timeframe === time ? 'contained' : 'outlined'}
              onClick={() => setTimeframe(time)} // Just update timeframe, useEffect will handle fetching
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
            dismissedComplaints.map((complaint) => (
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
                      <strong>Dismissed Reason:</strong> {complaint.dismiss_reason}
                    </Typography>
                    <Typography paragraph>
                      <strong>Dismissed By:</strong> {complaint.dismissed_by_name}
                    </Typography>
                    <Typography paragraph>
                      <strong>Dismissed At:</strong> {formatDateTime(complaint.dismissed_at)}
                    </Typography>

                    <Box sx={{ marginTop: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          marginTop: 2,
                          backgroundColor: '#F44336',
                          '&:hover': { backgroundColor: '#D32F2F' },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
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
