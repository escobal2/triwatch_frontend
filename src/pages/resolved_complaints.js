import { useEffect, useState, useCallback } from 'react';
import { 
  Container, Typography, Button, Grid, Divider, Alert, 
  MenuItem, Select, FormControl, InputLabel, TextField,
  Box, Card, CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
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

  // Resolved Complaint Card Component
  const ResolvedComplaintCard = ({ complaint }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0 // Important for flex items to allow shrinking below content size
    }}>
      {/* Card Header - Resolution Status */}
      <Box sx={{ 
        bgcolor: '#4CAF50', // Green for resolved status
        color: 'white', 
        py: { xs: 0.5, sm: 0.75 }, 
        px: { xs: 1, sm: 1.5 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography noWrap variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
          Complaint #{complaint.id}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: '#e8f5e9',
            color: '#2e7d32',
            px: 1,
            py: 0.25,
            ml: 0.5,
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <CheckCircleIcon sx={{ fontSize: '0.8rem' }} />
          Resolved
        </Typography>
      </Box>
  
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 0, 
        "&:last-child": { pb: 0 }, // Remove default padding at bottom
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Resolution Information */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#e8f5e9' }}>
          <Typography variant="subtitle2" color="#2e7d32" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <HistoryIcon sx={{ fontSize: '1rem' }} />
            Resolution Details
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  By:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    wordBreak: 'break-word',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    width: '100%'
                  }}
                >
                  {complaint.resolved_by_name}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Date:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatDateTime(complaint.resolved_at)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Resolution:
              </Typography>
              <Box sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1, 
                borderRadius: '4px', 
                maxHeight: { xs: '60px', sm: '70px', md: '80px' }, 
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                fontSize: { xs: '0.65rem', sm: '0.7rem' }
              }}>
                <Typography 
                  variant="caption" 
                  component="div"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {complaint.resolution}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Vehicle/Driver Information */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: complaint.driver_info ? '#fff8e1' : 'transparent' }}>
          <Typography variant="subtitle2" color="#FF6A00" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <LocalTaxiIcon sx={{ fontSize: '1rem' }} />
            Vehicle Information
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Plate:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                    bgcolor: '#f5f5f5',
                    px: 0.5,
                    py: 0.2,
                    borderRadius: '4px'
                  }}
                >
                  {complaint.franchise_plate_no}
                </Typography>
              </Box>
            </Grid>
            
            {/* Driver details if available */}
            {complaint.driver_info && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '60px', sm: '70px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Driver:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%'
                      }}
                    >
                      {complaint.driver_info.driver_name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '60px', sm: '70px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Association:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%'
                      }}
                    >
                      {complaint.driver_info.association}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '60px', sm: '70px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Address:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        width: '100%'
                      }}
                    >
                      {complaint.driver_info.address}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold', 
        color: '#424242',
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <CheckCircleIcon color="success" />
        Resolved Complaints
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

      {/* Timeframe Filter */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        borderRadius: '8px', 
        bgcolor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Filter by Timeframe
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {[
                { value: 'daily', label: 'Daily' },
                { value: 'specific_week', label: 'Custom Week' },
                { value: 'specific_month', label: 'By Month' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? 'contained' : 'outlined'}
                  onClick={() => setTimeframe(option.value)}
                  sx={{ 
                    borderRadius: '20px',
                    bgcolor: timeframe === option.value ? '#4CAF50' : 'transparent',
                    '&:hover': {
                      bgcolor: timeframe === option.value ? '#43a047' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                  size="small"
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </Grid>

          {/* Specific Week Selector */}
          {timeframe === 'specific_week' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Start Date (Monday)"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="End Date (Sunday)"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </Grid>
            </>
          )}

          {/* Month Selector */}
          {timeframe === 'specific_month' && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}>
                <InputLabel>Select Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  label="Select Month"
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
        </Grid>
      </Box>

      {/* Show loading or complaints */}
      {loadingReports ? (
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center', 
          py: 8,
          bgcolor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <Typography variant="body1">
            Loading resolved complaints...
          </Typography>
        </Box>
      ) : (
        resolvedComplaints.length > 0 ? (
          <Grid container spacing={2}>
            {resolvedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                <ResolvedComplaintCard complaint={complaint} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            py: 8,
            bgcolor: '#f9f9f9',
            borderRadius: '8px'
          }}>
            <Typography variant="body1">
              No resolved complaints available for the selected timeframe.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default ResolvedComplaints;