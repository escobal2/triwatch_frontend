import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, Grid, Divider, Alert, MenuItem, Select, FormControl, InputLabel, TextField, Box } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const DismissedComplaints = () => {
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily'); // Default timeframe
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default: current month
  const [startDate, setStartDate] = useState(''); // Start of the week (Monday)
  const [endDate, setEndDate] = useState(''); // End of the week (Sunday)
  const [firstLoad, setFirstLoad] = useState(true); // Track first load
  
  // Media query for small screens
  const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

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

  // Fetch dismissed complaints (including archived)
  const fetchDismissedComplaints = useCallback(async (selectedTimeframe, month = null, start = null, end = null) => {
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

      const response = await axios.get(`${API_BASE_URL}/dismissed-reports`, { params });

      // Parse driver_info JSON string before setting state
      const parsedComplaints = response.data.dismissed_complaints.map((complaint) => ({
        ...complaint,
        driver_info: complaint.driver_info ? JSON.parse(complaint.driver_info) : null, // Parse only if exists
      }));

      setDismissedComplaints(parsedComplaints);
    } catch (error) {
      console.error('Error fetching dismissed complaints:', error);
      setErrorMessage('Failed to fetch dismissed complaints.');
    } finally {
      setLoadingReports(false);
      setFirstLoad(false); // Disable first load after initial fetch
    }
  }, [firstLoad]);

  useEffect(() => {
    fetchDismissedComplaints(timeframe, selectedMonth, startDate, endDate);
    const interval = setInterval(() => fetchDismissedComplaints(timeframe, selectedMonth, startDate, endDate), 5000);
    return () => clearInterval(interval);
  }, [fetchDismissedComplaints, timeframe, selectedMonth, startDate, endDate]);

  // Dismissed Complaint Card Component
  const DismissedComplaintCard = ({ complaint }) => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0, // Important for flex items to allow shrinking below content size
      bgcolor: 'white'
    }}>
      {/* Card Header - Compact and responsive */}
      <Box sx={{ 
        bgcolor: '#e53935', // Reddish color for dismissed complaints
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
            bgcolor: '#f8bbd0',
            color: '#c2185b',
            px: 1,
            py: 0.25,
            ml: 0.5,
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            whiteSpace: 'nowrap'
          }}
        >
          Dismissed
        </Typography>
      </Box>
      
      {/* Main Content Section */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 0, 
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Dismissal Details Section */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#ffebee' }}>
          <Typography variant="subtitle2" color="#c62828" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Dismissal Information
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '65px' },
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
                  {complaint.dismissed_by_name}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '65px' },
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
                  {formatDateTime(complaint.dismissed_at)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Reason:
              </Typography>
              <Box sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1, 
                borderRadius: '4px', 
                maxHeight: { xs: '40px', sm: '50px', md: '60px' }, 
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                fontSize: { xs: '0.65rem', sm: '0.7rem' }
              }}>
                <Typography 
                  variant="caption" 
                  component="div"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {complaint.dismiss_reason}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Vehicle Information */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Vehicle Info
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography variant="caption" color="text.secondary" sx={{ 
              minWidth: { xs: '40px', sm: '65px' },
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
                bgcolor: '#e3f2fd',
                px: 0.5,
                py: 0.2,
                borderRadius: '4px'
              }}
            >
              {complaint.franchise_plate_no}
            </Typography>
          </Box>
        </Box>
        
        {/* Driver Information Section - Only if available */}
        {complaint.driver_info && (
          <>
            <Divider />
            <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
              <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                mb: 0.5
              }}>
                Driver Information
              </Typography>
              
              <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '65px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Name:
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
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '65px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Assoc:
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
                      minWidth: { xs: '40px', sm: '65px' },
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
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      {/* Header section with icon and title */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            fontWeight: 'bold',
            color: '#d32f2f'
          }}
        >
          ❌ Dismissed Complaints
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            ml: 2, 
            bgcolor: '#ffcdd2', 
            px: 1.5, 
            py: 0.5, 
            borderRadius: '16px',
            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
            display: { xs: 'none', sm: 'block' }
          }}
        >
          Active & Archived
        </Typography>
      </Box>

      {/* Error message if any */}
      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

      {/* Filter section - Responsive layout */}
      <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: '8px' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium', color: '#424242' }}>
          Filter by timeframe:
        </Typography>
        
        <Grid container spacing={2}>
          {/* Timeframe buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['daily', 'specific_week', 'specific_month'].map((time) => (
                <Button
                  key={time}
                  variant={timeframe === time ? 'contained' : 'outlined'}
                  onClick={() => setTimeframe(time)}
                  sx={{ 
                    mb: { xs: 1, sm: 0 },
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    bgcolor: timeframe === time ? '#d32f2f' : 'transparent',
                    '&:hover': {
                      bgcolor: timeframe === time ? '#b71c1c' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  {time.replace('_', ' ').charAt(0).toUpperCase() + time.replace('_', ' ').slice(1)}
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
                  label="Start Date (Monday)"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Date (Sunday)"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Grid>
            </>
          )}

          {/* Month Selector */}
          {timeframe === 'specific_month' && (
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
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

      {/* Complaints Grid */}
      {loadingReports ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4, 
          px: 2, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px', 
          border: '1px dashed #bdbdbd' 
        }}>
          <Typography variant="body1">
            Loading dismissed complaints...
          </Typography>
        </Box>
      ) : (
        dismissedComplaints.length > 0 ? (
          <Grid container spacing={2}>
            {dismissedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={complaint.id}>
                <DismissedComplaintCard complaint={complaint} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            px: 2, 
            bgcolor: '#f9f9f9', 
            borderRadius: '8px', 
            border: '1px dashed #bdbdbd' 
          }}>
            <Typography variant="body1">
              No dismissed complaints available.
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Try changing the timeframe filter to view more results.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default DismissedComplaints;