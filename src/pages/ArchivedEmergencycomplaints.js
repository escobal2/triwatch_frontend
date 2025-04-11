import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  CircularProgress,
  Alert
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import API_BASE_URL from '@/config/apiConfig';

// Helper function to format date and time
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  
  try {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return dateTimeString; // Return original string if parsing fails
  }
};

const ArchivedEmergencyComplaints = () => {
  const [archivedComplaints, setArchivedComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivedComplaints = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/archived-emergency-complaints`);
        
        if (response.data.archived_emergency_complaints) {
          setArchivedComplaints(response.data.archived_emergency_complaints);
        } else {
          setError('No archived complaints found in response.');
        }
      } catch (error) {
        console.error("Error fetching archived complaints:", error);
        setError('Failed to fetch archived complaints. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedComplaints();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#FF6A00' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      {archivedComplaints.length === 0 ? (
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            mt: 2
          }}>
            <Typography variant="body1" color="text.secondary">
              No archived Emergency Complaints found.
            </Typography>
          </Box>
        </Grid>
      ) : (
        archivedComplaints.map((complaint) => (
          <Grid item xs={12} sm={6} md={4} key={complaint.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: 0
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
                  Archived
                </Typography>
              </Box>
          
              <CardContent sx={{ 
                flexGrow: 1, 
                p: 0, 
                "&:last-child": { pb: 0 },
                overflowY: 'auto'
              }}>
                {/* Complainant Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    mb: 0.5
                  }}>
                    Complainant
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12} sm={6}>
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
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            width: '100%'
                          }}
                        >
                          {complaint.fullName}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '40px', sm: '50px' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Contact:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium" 
                          sx={{ 
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}
                        >
                          {complaint.contactNumber || 'Not provided'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* Incident Details */}
                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    mb: 0.5
                  }}>
                    Incident Details
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '40px', sm: '50px' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Type:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium"
                          sx={{
                            bgcolor: 
                              complaint.category === 'Assault' ? '#ffcdd2' : 
                              complaint.category === 'Overcharging' ? '#c8e6c9' : 
                              complaint.category === 'Lost Belonging' ? '#bbdefb' : '#e1f5fe',
                            px: 0.5,
                            py: 0.2,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                        >
                          {complaint.category}
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
                          {formatDateTime(complaint.incident_datetime)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    {complaint.location && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            minWidth: { xs: '40px', sm: '50px' },
                            flexShrink: 0,
                            pt: 0.1
                          }}>
                            Location:
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
                            {complaint.location}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Details:
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
                          {complaint.complaintDetails}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* Vehicle Info (if available) */}
                {complaint.franchise_plate_no && (
                  <>
                    <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
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
                      </Grid>
                    </Box>
                    <Divider />
                  </>
                )}
                
                {/* Additional Info Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#e3f2fd' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0
                    }}>
                      Archive Info
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: '#e8f5e9',
                      px: 0.5,
                      py: 0.25,
                      borderRadius: '4px',
                      maxWidth: '60%',
                      overflow: 'hidden'
                    }}>
                      <AccountCircleIcon sx={{ 
                        fontSize: { xs: 12, sm: 14 }, 
                        mr: 0.5, 
                        color: '#2e7d32'
                      }} />
                      <Typography 
                        variant="caption" 
                        fontWeight="medium" 
                        sx={{ 
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: { xs: '0.65rem', sm: '0.7rem' }
                        }}
                      >
                        {complaint.archived_by || 'System'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* File attachment (if available) */}
                {complaint.file_url && (
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 },
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Typography 
                      component="a"
                      href={complaint.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: '#0384fc',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'medium',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      View Attached File
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ArchivedEmergencyComplaints;