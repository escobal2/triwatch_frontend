import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, Divider, Alert } from '@mui/material';
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
    <Container maxWidth={false} sx={{ 
      paddingTop: { xs: 2, sm: 3, md: 4 },
      paddingX: { xs: 1, sm: 2, md: 3 },
      width: '100%'
    }}>
      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
        {skPersonnel.map((person) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={person.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
              borderRadius: { xs: '8px', sm: '12px' },
              overflow: 'hidden',
              width: '100%'
            }}>
              {/* Card Header */}
              <Box sx={{ 
                bgcolor: '#FF6A00', 
                color: 'white', 
                py: { xs: 0.5, sm: 0.75 }, 
                px: { xs: 1, sm: 1.5 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 0.5
              }}>
                <Typography 
                  noWrap 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.9rem', md: '1rem' },
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
                      px: 1,
                      py: 0.25,
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.6rem', sm: '0.7rem' },
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
                "&:last-child": { pb: 0 },
                overflowY: 'auto'
              }}>
                {/* Personnel Information Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    mb: 0.5
                  }}>
                    Personal Information
                  </Typography>
                  
                  {/* Removed nested Grid here */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                      <PersonIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '40px', sm: '50px' },
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
                      <PhoneIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '40px', sm: '50px' },
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
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#e3f2fd' }}>
                  <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    mb: 0.5
                  }}>
                    Account Details
                  </Typography>
                  
                  {/* Removed nested Grid here too */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                      <BadgeIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mt: 0.1 }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '40px', sm: '50px' },
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
                        letterSpacing: '0.5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-all',
                        flexGrow: 1
                      }}
                    >
                      {person.id}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Box sx={{ width: '0.9rem', flexShrink: 0, mr: 0.5 }}>
                      {/* Spacer to align with icons above */}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      width: { xs: '40px', sm: '50px' },
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
                          py: 0.2,
                          borderRadius: '4px',
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
                  p: { xs: 0.75, sm: 1 },
                  display: 'flex', 
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5',
                  width: '100%'
                }}>
                  <Button
                    startIcon={<DeleteIcon sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />}
                    onClick={() => deleteAccount(person.username)}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#DB0606',
                      borderRadius: '16px',
                      '&:hover': { backgroundColor: '#b20000' },
                      width: '100%',
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      py: { xs: 0.5, sm: 0.75 },
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
    </Container>
  );
};

export default SKPersonnelList;