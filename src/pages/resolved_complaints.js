import { useEffect, useState, useCallback } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Divider, Alert, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const ResolvedComplaints = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // Default timeframe
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: current month
  const [startDate, setStartDate] = useState(''); // Start of the week (Monday)
  const [endDate, setEndDate] = useState(''); // End of the week (Sunday)
  const [firstLoad, setFirstLoad] = useState(true); // Track first load

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

  // Fetch resolved complaints
  const fetchResolvedComplaints = useCallback(async (selectedTimeframe, month = null, start = null, end = null) => {
    if (firstLoad) setLoadingReports(true); // Show loading only on first load
    setErrorMessage(null);

    try {
      const params = { timeframe: selectedTimeframe, include_archived: true };
      if (selectedTimeframe === 'specific_month') {
        params.month = month; // Send selected month to backend
      } else if (selectedTimeframe === 'specific_week' && start && end) {
        params.start_date = start; // Send start date (Monday)
        params.end_date = end; // Send end date (Sunday)
      }

      const response = await axios.get(`${API_BASE_URL}/resolved-reports`, { params });

      console.log('Fetched Resolved Complaints:', response.data.resolved_complaints);

      const parsedComplaints = response.data.resolved_complaints.map((complaint) => ({
        ...complaint,
        driver_info: complaint.driver_info ? JSON.parse(complaint.driver_info) : null, // Parse only if exists
      }));

      setResolvedComplaints(parsedComplaints);
    } catch (error) {
      console.error('Error fetching resolved complaints:', error);
      setErrorMessage('Failed to fetch resolved complaints.');
    } finally {
      setLoadingReports(false);
      setFirstLoad(false); // Disable first load after initial fetch
    }
  }, [firstLoad]);

  useEffect(() => {
    fetchResolvedComplaints(timeframe, selectedMonth, startDate, endDate);
    const interval = setInterval(() => fetchResolvedComplaints(timeframe, selectedMonth, startDate, endDate), 5000);
    return () => clearInterval(interval);
  }, [fetchResolvedComplaints, timeframe, selectedMonth, startDate, endDate]);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧾 Resolved Complaints (Active & Archived)
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

      <Grid container spacing={3}>
        {/* Timeframe Filter */}
        <Grid item xs={12}>
          {['daily', 'specific_week', 'specific_month'].map((time) => (
            <Button
              key={time}
              variant={timeframe === time ? 'contained' : 'outlined'}
              onClick={() => setTimeframe(time)}
              sx={{ marginRight: 2 }}
            >
              {time.replace('_', ' ').charAt(0).toUpperCase() + time.replace('_', ' ').slice(1)}
            </Button>
          ))}
        </Grid>

        {/* Specific Week Selector (Only shown when 'specific_week' is selected) */}
        {timeframe === 'specific_week' && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Date (Monday)"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Date (Sunday)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}

        {/* Month Selector (Only shown when 'specific_month' is selected) */}
        {timeframe === 'specific_month' && (
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Select Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((month, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Show loading only during first load */}
        {loadingReports ? (
          <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', marginTop: 3 }}>
            Loading resolved complaints...
          </Typography>
        ) : (
          resolvedComplaints.length > 0 ? (
            resolvedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
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

                    {complaint.driver_info && (
                      <>
                        <Divider sx={{ marginY: 2 }} />
                        <Typography variant="subtitle1">🚖 Driver Information</Typography>
                        <Typography paragraph>
                          <strong>Name:</strong> {complaint.driver_info.driver_name}
                        </Typography>
                        <Typography paragraph>
                          <strong>Association:</strong> {complaint.driver_info.association}
                        </Typography>
                        <Typography paragraph>
                          <strong>Address:</strong> {complaint.driver_info.address}
                        </Typography>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ width: '100%', textAlign: 'center', marginTop: 3 }}>
              No resolved complaints available.
            </Typography>
          )
        )}
      </Grid>
    </Container>
  );
};

export default ResolvedComplaints;
