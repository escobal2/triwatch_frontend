import { useEffect, useState, useCallback } from 'react';
import { 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Divider, 
  Alert, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  TextField 
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const DismissedComplaints = () => {
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [timeframe, setTimeframe] = useState('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);

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
    if (firstLoad) setLoadingReports(true);
    setErrorMessage(null);

    try {
      const params = { timeframe: selectedTimeframe, include_archived: true };
      if (selectedTimeframe === 'specific_month') {
        params.month = month;
      } else if (selectedTimeframe === 'specific_week' && start && end) {
        params.start_date = start;
        params.end_date = end;
      }

      const response = await axios.get(`${API_BASE_URL}/dismissed-reports`, { params });

      console.log('Fetched Dismissed Complaints:', response.data.dismissed_complaints);

      // Parse driver_info JSON string before setting state
      const parsedComplaints = response.data.dismissed_complaints.map((complaint) => ({
        ...complaint,
        driver_info: complaint.driver_info ? JSON.parse(complaint.driver_info) : null,
      }));

      setDismissedComplaints(parsedComplaints);
    } catch (error) {
      console.error('Error fetching dismissed complaints:', error);
      setErrorMessage('Failed to fetch dismissed complaints.');
    } finally {
      setLoadingReports(false);
      setFirstLoad(false);
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
      minWidth: 0,
      backgroundColor: 'white'
    }}>
      {/* Card Header */}
      <Box sx={{ 
        bgcolor: '#FF6A00', 
        color: 'white', 
        py: { xs: 0.5, sm: 0.75 }, 
        px: { xs: 1, sm: 1.5 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography noWrap variant="subtitle1" fontWeight="bold" sx={{ 
          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
          maxWidth: '70%'
        }}>
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
        overflowY: 'auto'
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
                  maxWidth: 'calc(100% - 60px)',
                  overflow: 'hidden'
                }}>
                  <AccountCircle sx={{ 
                    fontSize: { xs: 12, sm: 14 }, 
                    mr: 0.5, 
                    color: '#0384fc',
                    flexShrink: 0
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
                    letterSpacing: '0.5px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {complaint.franchise_plate_no || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            {/* Driver details if available */}
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
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100vw',
      margin: 0,
      padding: { xs: 1, sm: 2, md: 3 },
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {errorMessage && (
        <Alert 
          severity="error" 
          sx={{ 
            marginBottom: 2, 
            borderRadius: '8px',
            width: '100%'
          }}
        >
          {errorMessage}
        </Alert>
      )}

      <Box sx={{ mb: 3, mt: 2, width: '100%' }}>
        <Typography variant="subtitle1" color="text.secondary" mb={1} sx={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
          Filter by timeframe:
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          width: '100%'
        }}>
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
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                flexGrow: { xs: 1, sm: 0 }
              }}
            >
              {time.replace('_', ' ').charAt(0).toUpperCase() + time.replace('_', ' ').slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Specific Week Selector */}
      {timeframe === 'specific_week' && (
        <Box sx={{ 
          mb: 3, 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          width: '100%'
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

      {/* Month Selector */}
      {timeframe === 'specific_month' && (
        <Box sx={{ 
          mb: 3, 
          p: { xs: 1.5, sm: 2 }, 
          bgcolor: '#f9f9f9', 
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          width: '100%'
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

      {/* Loading or Results */}
      {loadingReports ? (
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center', 
          marginTop: 3,
          p: { xs: 2, sm: 3 },
          bgcolor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <Typography variant="body1">
            Loading dismissed complaints...
          </Typography>
        </Box>
      ) : (
        dismissedComplaints.length > 0 ? (
          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ width: '100%', margin: 0 }}>
            {dismissedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={complaint.id} sx={{ width: '100%' }}>
                <DismissedComplaintCard complaint={complaint} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            width: '100%', 
            textAlign: 'center', 
            marginTop: 3,
            p: { xs: 2, sm: 3, md: 4 },
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
    </Box>
  );
};

export default DismissedComplaints;