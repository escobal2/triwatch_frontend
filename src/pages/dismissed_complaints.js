import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, Grid, Box, Divider, Alert, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
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

      console.log('Fetched Dismissed Complaints:', response.data.dismissed_complaints);

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

  const DismissedComplaintCard = ({ complaint }) => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0, // Important for flex items to allow shrinking below content size
      backgroundColor: 'white'
    }}>
      {/* Card Header - Compact and responsive */}
      <Box sx={{ 
        bgcolor: '#FF6A00', 
        color: 'white', 
        py: { xs: 0.5, sm: 0.75 }, 
        px: { xs: 1, sm: 1.5 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography noWrap variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
          Dismissed #{complaint.id}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: '#81c784',
            color: '#2e7d32',
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
      
      <Box sx={{ 
        flexGrow: 1,
        p: 0,
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Dismissed By Section */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Dismissal Info
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {/* Two column layout that becomes single column on very small screens */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '45px', sm: '60px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  By:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  maxWidth: 'calc(100% - 60px)'
                }}>
                  <AccountCircle sx={{ 
                    fontSize: { xs: 12, sm: 14 }, 
                    mr: 0.5, 
                    color: '#0384fc' 
                  }} />
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
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '45px', sm: '60px' },
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
        
        {/* Vehicle Information - Streamlined */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: complaint.driver_info ? '#fff8e1' : 'transparent' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Vehicle Info
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
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
                    letterSpacing: '0.5px'
                  }}
                >
                  {complaint.franchise_plate_no || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            {/* Driver details if available - compressed */}
            {complaint.driver_info && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '50px' },
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
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '50px' },
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
                      minWidth: { xs: '40px', sm: '50px' },
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
                        WebkitLineClamp: 1,
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
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>

      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2, borderRadius: '8px' }}>{errorMessage}</Alert>}

      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography variant="subtitle1" color="text.secondary" mb={1} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          Filter by timeframe:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['daily', 'specific_week', 'specific_month'].map((time) => (
            <Button
              key={time}
              variant={timeframe === time ? 'contained' : 'outlined'}
              onClick={() => setTimeframe(time)}
              sx={{ 
                borderRadius: '20px',
                textTransform: 'capitalize',
                bgcolor: timeframe === time ? '#FF6A00' : 'transparent',
                borderColor: '#FF6A00',
                color: timeframe === time ? 'white' : '#FF6A00',
                '&:hover': {
                  bgcolor: timeframe === time ? '#FB8C00' : 'rgba(255, 106, 0, 0.04)',
                  borderColor: '#FB8C00'
                },
                fontSize: { xs: '0.75rem', sm: '0.8rem' }
              }}
            >
              {time.replace('_', ' ').charAt(0).toUpperCase() + time.replace('_', ' ').slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Specific Week Selector (Only shown when 'specific_week' is selected) */}
      {timeframe === 'specific_week' && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="subtitle2" mb={1} color="#0384fc" fontWeight="bold">
            Select Date Range
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date (Monday)"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }
                }}
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
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontSize: '0.875rem'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Month Selector (Only shown when 'specific_month' is selected) */}
      {timeframe === 'specific_month' && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="subtitle2" mb={1} color="#0384fc" fontWeight="bold">
            Select Month
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              label="Month"
              sx={{ 
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
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
        </Box>
      )}

      {/* Show loading only during first load */}
      {loadingReports ? (
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center', 
          marginTop: 5,
          p: 3,
          bgcolor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <Typography variant="body1">
            Loading dismissed complaints...
          </Typography>
        </Box>
      ) : (
        dismissedComplaints.length > 0 ? (
          <Grid container spacing={2}>
            {dismissedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                <DismissedComplaintCard complaint={complaint} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            marginTop: 5,
            p: 4,
            bgcolor: '#f5f5f5',
            borderRadius: '8px',
            border: '1px dashed #ccc'
          }}>
            <Typography variant="body1" color="text.secondary">
              No dismissed complaints available.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default DismissedComplaints;