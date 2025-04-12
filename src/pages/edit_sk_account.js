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
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>

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

      <Grid container spacing={3}>
        {skPersonnel.map((person) => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
              borderRadius: '12px',
              overflow: 'hidden',
              minWidth: 0
            }}>
              {/* Card Header - Similar to ComplaintCard */}
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
                  {person.username}
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
                  {person.role}
                </Typography>
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
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <PersonIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5, mt: 0.1 }} />
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
                          {person.fullname}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <PhoneIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5, mt: 0.1 }} />
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
                          {person.contactnum || 'Not provided'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
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
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <BadgeIcon sx={{ fontSize: '0.9rem', color: 'text.secondary', mr: 0.5, mt: 0.1 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '40px', sm: '50px' },
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
                            letterSpacing: '0.5px'
                          }}
                        >
                          {person.id}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '40px', sm: '50px' },
                          ml: { xs: '1.2rem', sm: '1.4rem' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Role:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium"
                          sx={{
                            bgcolor: 
                              person.role === 'Admin' ? '#ffcdd2' : 
                              person.role === 'Officer' ? '#c8e6c9' : '#e1f5fe',
                            px: 0.5,
                            py: 0.2,
                            borderRadius: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '100%'
                          }}
                        >
                          {person.role}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* Action button - similar styling to ComplaintCard */}
                <Box sx={{ 
                  p: { xs: 0.5, sm: 1 },
                  display: 'flex', 
                  gap: 0.5,
                  justifyContent: 'space-between',
                  bgcolor: '#f5f5f5'
                }}>
                  <Button
                    startIcon={<DeleteIcon sx={{ fontSize: '0.9rem' }} />}
                    onClick={() => deleteAccount(person.username)}
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#DB0606',
                      borderRadius: '16px',
                      '&:hover': { backgroundColor: '#b20000' },
                      flexGrow: 1,
                      fontSize: { xs: '0.65rem', sm: '0.7rem' },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 0.5, sm: 1 },
                      minWidth: 0,
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