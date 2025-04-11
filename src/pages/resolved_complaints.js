import { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Button, Grid, Divider, Alert, MenuItem, Select, FormControl, InputLabel, TextField, Box } from '@mui/material';
import { AccountCircle, CheckCircle } from '@mui/icons-material';
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

  // Component for individual resolved complaint cards
  const ResolvedComplaintCard = ({ complaint }) => (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0 // Important for flex items to allow shrinking below content size
    }}>
      {/* Card Header */}
      <Box sx={{ 
        bgcolor: '#0384fc', 
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
          Resolved
        </Typography>
      </Box>
  
      {/* Card Content */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 0, 
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Resolution Section */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#e8f5e9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Resolution Information
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '50px', sm: '60px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  By:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountCircle sx={{ fontSize: '14px', mr: 0.5, color: '#2e7d32' }} />
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
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '50px', sm: '60px' },
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
                  {complaint.resolution}
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
                    letterSpacing: '0.5px'
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
        
        {/* Bottom status indicator */}
        <Box sx={{ 
          p: { xs: 0.75, sm: 1 },
          bgcolor: '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <CheckCircle sx={{ 
            color: '#2e7d32', 
            fontSize: { xs: '0.9rem', sm: '1rem' } 
          }} />
          <Typography 
            variant="caption" 
            fontWeight="bold"
            sx={{ 
              color: '#2e7d32',
              fontSize: { xs: '0.7rem', sm: '0.8rem' }
            }}
          >
            ISSUE RESOLVED
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem' },
        fontWeight: 'bold',
        color: '#0384fc'
      }}>
        🧾 Resolved Complaints
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2, borderRadius: '8px' }}>
          {errorMessage}
        </Alert>
      )}

      {/* Filter Controls Section */}
      <Box sx={{ 
        mb: 3,
        p: 2,
        borderRadius: '12px',
        bgcolor: '#f5f5f5',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="subtitle1" gutterBottom sx={{ 
          fontWeight: 'bold',
          color: '#0384fc',
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          Filter Resolved Cases
        </Typography>
        
        {/* Timeframe Filter Buttons */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 1,
          mb: 2
        }}>
          {['daily', 'specific_week', 'specific_month'].map((time) => (
            <Button
              key={time}
              variant={timeframe === time ? 'contained' : 'outlined'}
              onClick={() => setTimeframe(time)}
              sx={{ 
                borderRadius: '20px',
                textTransform: 'capitalize',
                bgcolor: timeframe === time ? '#0384fc' : 'transparent',
                borderColor: '#0384fc',
                color: timeframe === time ? 'white' : '#0384fc',
                fontSize: { xs: '0.7rem', sm: '0.8rem' },
                '&:hover': {
                  bgcolor: timeframe === time ? '#0366d6' : 'rgba(3, 132, 252, 0.1)'
                }
              }}
            >
              {time.replace('_', ' ')}
            </Button>
          ))}
        </Box>

        {/* Specific Week Selectors */}
        {timeframe === 'specific_week' && (
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
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
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
                    fontSize: { xs: '0.8rem', sm: '0.9rem' }
                  }
                }}
              />
            </Grid>
          </Grid>
        )}

        {/* Month Selector */}
        {timeframe === 'specific_month' && (
          <FormControl fullWidth size="small" sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }
          }}>
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
        )}
      </Box>

      {/* Complaints Grid */}
      {loadingReports ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          bgcolor: '#f9f9f9',
          borderRadius: '12px'
        }}>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Loading resolved complaints...
          </Typography>
        </Box>
      ) : (
        resolvedComplaints.length > 0 ? (
          <Grid container spacing={2}>
            {resolvedComplaints.map((complaint) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={complaint.id}>
                <ResolvedComplaintCard complaint={complaint} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            bgcolor: '#f9f9f9',
            borderRadius: '12px',
            border: '1px dashed #ccc'
          }}>
            <Typography variant="body1" sx={{ color: '#666' }}>
              No resolved complaints available for the selected timeframe.
            </Typography>
          </Box>
        )
      )}
    </Container>
  );
};

export default ResolvedComplaints;