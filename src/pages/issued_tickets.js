import { useEffect, useState, useCallback } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Divider, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const IssuedTickets = () => {
  const [issuedTickets, setIssuedTickets] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // Default timeframe

  // Format date function
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

  // Fetch issued tickets (including archived)
  const fetchIssuedTickets = useCallback(async (timeframe) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issued-tickets`, {
        params: { timeframe, include_archived: true }, // Add this
    });

      console.log('Fetched Issued Tickets:', response.data.issued_tickets);
      setIssuedTickets(response.data.issued_tickets);
    } catch (error) {
      console.error('Error fetching issued tickets:', error);
      setErrorMessage('Failed to fetch issued tickets.');
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    fetchIssuedTickets(timeframe);
    const interval = setInterval(() => fetchIssuedTickets(timeframe), 5000);
    return () => clearInterval(interval);
  }, [fetchIssuedTickets, timeframe]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        🎫 Issued Tickets (Active & Archived)
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

      <Grid container spacing={3}>
        {/* Timeframe Filter */}
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
            Loading issued tickets...
          </Typography>
        ) : (
          issuedTickets.length > 0 ? (
            issuedTickets.map((ticket) => {
              const driverInfo = ticket.driver_info ? JSON.parse(ticket.driver_info) : {};
              const isArchived = ticket.archived_at !== null; // Check if ticket is archived

              return (
                <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 3,
                      borderRadius: 2,
                      backgroundColor: isArchived ? '#f5f5f5' : 'white', // Grey background for archived tickets
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ticket ID: {ticket.id} {isArchived}
                      </Typography>
                      <Typography paragraph>
                        <strong>Issued By:</strong> {ticket.resolved_by_name}
                      </Typography>
                      <Typography paragraph>
                        <strong>Issued At:</strong> {formatDateTime(ticket.resolved_at)}
                      </Typography>
                      <Typography paragraph>
                        <strong>Ticket Number:</strong> {ticket.ticket_number}
                      </Typography>
                      <Typography paragraph>
                        <strong>Franchise Plate Number:</strong> {ticket.franchise_plate_no}
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
              No issued tickets available for this timeframe.
            </Typography>
          )
        )}
      </Grid>
    </Container>
  );
};

export default IssuedTickets;
