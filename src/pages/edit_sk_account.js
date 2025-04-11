import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, Alert, Divider } from '@mui/material';
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
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallMobile(window.innerWidth < 400);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

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
    
    return () => window.removeEventListener('resize', checkScreenSize);
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
    <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ 
          fontWeight: 'bold', 
          color: '#333',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
          mb: 3
        }}
      >
        SK Personnel Accounts
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ marginBottom: 2, borderRadius: '8px' }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ marginBottom: 2, borderRadius: '8px' }}>
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
              minWidth: 0 // Allow shrinking below content size
            }}>
              {/* Card Header - Matching the complaint card style */}
              <Box sx={{ 
                bgcolor: '#0384fc', 
                color: 'white', 
                py: { xs: 0.5, sm: 0.75 }, 
                px: { xs: 1, sm: 1.5 },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography 
                  noWrap 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
                >
                  Personnel ID: {person.id}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    color: '#0384fc',
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
                "&:last-child": { pb: 0 }, // Remove default padding at bottom
                overflowY: 'auto' // Allow scrolling if content is too large
              }}>
                {/* Personal Information Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                  <Typography 
                    variant="subtitle2" 
                    color="#0384fc" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0.5
                    }}
                  >
                    Personal Information
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
                        <PersonIcon 
                          sx={{ 
                            color: '#0384fc', 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            mr: 1,
                            mt: 0.1
                          }} 
                        />
                        <Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ display: 'block' }}
                          >
                            Full Name:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium" 
                            sx={{ 
                              wordBreak: 'break-word',
                              fontSize: { xs: '0.7rem', sm: '0.8rem' }
                            }}
                          >
                            {person.fullname}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
                        <PhoneIcon 
                          sx={{ 
                            color: '#0384fc', 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            mr: 1,
                            mt: 0.1
                          }} 
                        />
                        <Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ display: 'block' }}
                          >
                            Contact Number:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium" 
                            sx={{ 
                              fontFamily: 'monospace',
                              letterSpacing: '0.5px',
                              fontSize: { xs: '0.7rem', sm: '0.8rem' }
                            }}
                          >
                            {person.contactnum || 'Not provided'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* Account Information Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="#0384fc" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0.5
                    }}
                  >
                    Account Information
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.75 }}>
                        <BadgeIcon 
                          sx={{ 
                            color: '#0384fc', 
                            fontSize: { xs: '0.9rem', sm: '1rem' },
                            mr: 1,
                            mt: 0.1
                          }} 
                        />
                        <Box>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ display: 'block' }}
                          >
                            Username:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="medium" 
                            sx={{ 
                              backgroundColor: '#e3f2fd',
                              borderRadius: '4px',
                              px: 1,
                              py: 0.5,
                              display: 'inline-block',
                              fontSize: { xs: '0.7rem', sm: '0.8rem' }
                            }}
                          >
                            {person.username}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            minWidth: { xs: '40px', sm: '60px' },
                            flexShrink: 0,
                            pt: 0.1
                          }}
                        >
                          Role Status:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium"
                          sx={{
                            bgcolor: 
                              person.role === 'Admin' ? '#ffcdd2' : 
                              person.role === 'Supervisor' ? '#bbdefb' : '#c8e6c9',
                            px: 0.75,
                            py: 0.25,
                            borderRadius: '4px',
                            fontSize: { xs: '0.65rem', sm: '0.7rem' }
                          }}
                        >
                          {person.role}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* Action Section */}
                <Box sx={{ 
                  p: { xs: 0.75, sm: 1 },
                  display: 'flex',
                  justifyContent: 'center',
                  bgcolor: '#f5f5f5'
                }}>
                  <Button
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteAccount(person.username)}
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#DB0606',
                      borderRadius: '16px',
                      '&:hover': { backgroundColor: '#b30000' },
                      py: { xs: 0.5, sm: 0.75 },
                      px: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      maxWidth: '80%'
                    }}
                  >
                    {isSmallMobile ? '' : 'Delete Account'}
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