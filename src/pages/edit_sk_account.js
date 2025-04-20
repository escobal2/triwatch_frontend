import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Divider, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const SKPersonnelList = () => {
  const [skPersonnel, setSKPersonnel] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sk_personnel`);
        setSKPersonnel(response.data.retrieved_data);
      } catch (error) {
        console.error('Error fetching SK personnel accounts:', error);
        setErrorMessage("Failed to fetch accounts.");
      }
    };

    fetchAccounts();
  }, []);

  const deleteAccount = async (username) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/delete_account/${username}`);
      setSuccessMessage(res.data.message);
      setErrorMessage(null);
      
      setSKPersonnel((prevPersonnel) => prevPersonnel.filter(person => person.username !== username));
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage("Failed to delete account.");
      setSuccessMessage(null);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 1 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 1 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={{ xs: 0.5, sm: 1 }}>
        {skPersonnel.map((person) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={person.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
              borderRadius: { xs: '6px', sm: '8px' },
              overflow: 'hidden',
              width: '100%'
            }}>
              {/* Card Header */}
              <Box sx={{ 
                bgcolor: '#FF6A00', 
                color: 'white', 
                py: { xs: 0.25, sm: 0.5 }, 
                px: { xs: 0.75, sm: 1 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.25
              }}>
                <Typography 
                  noWrap 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                    flexGrow: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {person.username}
                </Typography>
                <Box sx={{ flexShrink: 0 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: '#81c784',
                      color: '#2e7d32',
                      px: 0.75,
                      py: 0.15,
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.55rem', sm: '0.65rem' },
                      whiteSpace: 'nowrap',
                      display: 'inline-block'
                    }}
                  >
                    {person.role}
                  </Typography>
                </Box>
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                p: 0, 
                "&:last-child": { pb: 0 }
              }}>
                {/* Personnel Information Section */}
                <Box sx={{ p: { xs: 0.75, sm: 1.25 }, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    mb: 0.5
                  }}>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
                    <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                      <PersonIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '36px', sm: '42px' },
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
                        flexGrow: 1
                      }}
                    >
                      {person.fullname}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '36px', sm: '42px' },
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
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        flexGrow: 1
                      }}
                    >
                      {person.contactnum || 'Not provided'}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider />
                
                {/* Account Details */}
                <Box sx={{ p: { xs: 0.75, sm: 1.25 }, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    mb: 0.5
                  }}>
                    Account Details
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
                    <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                      <BadgeIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '36px', sm: '42px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      ID:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium" 
                      sx={{ 
                        fontFamily: 'monospace',
                        letterSpacing: '0.25px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-all',
                        maxWidth: '100%'
                      }}
                    >
                      {person.id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '0.85rem', flexShrink: 0, mr: 0.5 }}>
                      {/* Spacer to align with icons above */}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '36px', sm: '42px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Role:
                    </Typography>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                      <Typography 
                        variant="caption" 
                        fontWeight="medium"
                        sx={{
                          display: 'inline-block',
                          bgcolor: 
                            person.role === 'Admin' ? '#ffcdd2' : 
                            person.role === 'Officer' ? '#c8e6c9' : '#e1f5fe',
                          px: 0.5,
                          py: 0.1,
                          borderRadius: '3px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%'
                        }}
                      >
                        {person.role}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Divider />
                
                {/* Action button */}
                <Box sx={{ 
                  p: { xs: 0.5, sm: 0.75 },
                  display: 'flex', 
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  width: '100%'
                }}>
                  <Button
                    startIcon={<DeleteIcon sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }} />}
                    onClick={() => deleteAccount(person.username)}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#DB0606',
                      borderRadius: '12px',
                      '&:hover': { backgroundColor: '#b20000' },
                      width: '100%',
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      py: { xs: 0.25, sm: 0.5 },
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SKPersonnelList;