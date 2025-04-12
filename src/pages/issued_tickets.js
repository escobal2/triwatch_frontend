import { useEffect, useState, useCallback } from 'react';
import { 
  Container, Typography, Button, Grid, Divider, Alert, MenuItem, 
  Select, FormControl, InputLabel, TextField, Box, Card, CardContent
} from '@mui/material';
import { AccessTime, EventNote, LocalTaxi } from '@mui/icons-material';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const IssuedTickets = () => {
  const [issuedTickets, setIssuedTickets] = useState([]);
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

  // Fetch issued tickets
  const fetchIssuedTickets = useCallback(async (selectedTimeframe, month = null, start = null, end = null) => {
    if (firstLoad) setLoadingReports(true); // Only show loading on first load
    setErrorMessage(null);

    try {
      const params = { timeframe: selectedTimeframe, include_archived: true };
      if (selectedTimeframe === 'specific_month') {
        params.month = month; // Send selected month to backend
      } else if (selectedTimeframe === 'specific_week' && start && end) {
        params.start_date = start; // Send start date (Monday)
        params.end_date = end; // Send end date (Sunday)
      }

      const response = await axios.get(`${API_BASE_URL}/issued-tickets`, { params });
      
      const parsedTickets = response.data.issued_tickets.map((ticket) => ({
        ...ticket,
        driver_info: ticket.driver_info ? JSON.parse(ticket.driver_info) : null, // Parse only if exists
      }));

      setIssuedTickets(parsedTickets);
    } catch (error) {
      console.error('Error fetching issued tickets:', error);
      setErrorMessage('Failed to fetch issued tickets.');
    } finally {
      setLoadingReports(false);
      setFirstLoad(false); // Disable first load after initial fetch
    }
  }, [firstLoad]);

  useEffect(() => {
    fetchIssuedTickets(timeframe, selectedMonth, startDate, endDate);
    const interval = setInterval(() => fetchIssuedTickets(timeframe, selectedMonth, startDate, endDate), 5000);
    return () => clearInterval(interval);
  }, [fetchIssuedTickets, timeframe, selectedMonth, startDate, endDate]);

  // Ticket Card Component
  const TicketCard = ({ ticket }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0 // Important for flex items to allow shrinking below content size
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
          Ticket #{ticket.id}
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
          Issued
        </Typography>
      </Box>

      <CardContent sx={{ 
        flexGrow: 1, 
        p: 0, 
        "&:last-child": { pb: 0 }, // Remove default padding at bottom
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Resolution Details */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Resolution
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {/* Two column layout that becomes single column on very small screens */}
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Resolved By:
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
                  {ticket.resolved_by_name}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Date:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: { xs: '0.65rem', sm: '0.7rem' }
                  }}
                >
                  <AccessTime sx={{ fontSize: '0.8rem' }} />
                  {formatDateTime(ticket.resolved_at)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Resolution Note:
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
                  {ticket.resolution}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Ticket Information */}
        <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Ticket Details
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Number:
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
                  {ticket.ticket_number}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
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
                    bgcolor: '#fff8e1',
                    px: 0.5,
                    py: 0.2,
                    borderRadius: '4px'
                  }}
                >
                  {ticket.franchise_plate_no}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Driver Information - Only if available */}
        {ticket.driver_info && (
          <>
            <Divider />
            <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <LocalTaxi sx={{ fontSize: '0.9rem', color: '#0384fc', mr: 0.5 }} />
                <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.85rem' }
                }}>
                  Driver Information
                </Typography>
              </Box>
              
              <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '50px' },
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
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        width: '100%'
                      }}
                    >
                      {ticket.driver_info.driver_name}
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
                      {ticket.driver_info.association}
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
                      {ticket.driver_info.address}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4, paddingBottom: 4 }}>

      {errorMessage && <Alert severity="error" sx={{ marginBottom: 2 }}>{errorMessage}</Alert>}

      <Box sx={{ mb: 3, bgcolor: '#f5f5f5', borderRadius: 2, p: 2 }}>
        {/* Timeframe Filter */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ mb: 1 }}>
              <EventNote sx={{ fontSize: '1rem', verticalAlign: 'text-bottom', mr: 0.5 }} />
              Filter by Timeframe
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['daily', 'specific_week', 'specific_month'].map((time) => (
                <Button
                  key={time}
                  variant={timeframe === time ? 'contained' : 'outlined'}
                  onClick={() => setTimeframe(time)}
                  size="small"
                  sx={{ 
                    textTransform: 'capitalize',
                    bgcolor: timeframe === time ? '#FF6A00' : 'transparent',
                    borderColor: '#FF6A00',
                    color: timeframe === time ? 'white' : '#FF6A00',
                    '&:hover': {
                      bgcolor: timeframe === time ? '#FB8C00' : 'rgba(255, 106, 0, 0.1)'
                    },
                    borderRadius: '16px',
                    px: { xs: 1, sm: 2 }
                  }}
                >
                  {time.replace('_', ' ')}
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

      {/* Loading and Results */}
      {loadingReports ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1">
            Loading issued tickets...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {issuedTickets.length > 0 ? (
            issuedTickets.map((ticket) => (
              <Grid item xs={12} sm={6} md={4} key={ticket.id}>
                <TicketCard ticket={ticket} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 4, 
                bgcolor: '#f5f5f5', 
                borderRadius: 2,
                border: '1px dashed #ccc'
              }}>
                <Typography variant="body1">
                  No issued tickets available for the selected timeframe.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default IssuedTickets;