import { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider, 
  Alert,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircle from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const SKPersonnelList = ({ searchTerm = '' }) => {
  const [skPersonnel, setSKPersonnel] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/sk_personnel`);
        setSKPersonnel(response.data.retrieved_data || []);
      } catch (error) {
        console.error('Error fetching SK personnel accounts:', error);
        setErrorMessage("Failed to fetch accounts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Filter personnel based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPersonnel(skPersonnel);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = skPersonnel.filter(person => 
      person.username?.toLowerCase().includes(searchTermLower) ||
      person.fullname?.toLowerCase().includes(searchTermLower) ||
      person.contactnum?.toLowerCase().includes(searchTermLower) ||
      person.role?.toLowerCase().includes(searchTermLower) ||
      person.id?.toString().includes(searchTermLower)
    );
    
    setFilteredPersonnel(filtered);
  }, [searchTerm, skPersonnel]);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: '#FF6A00' }} />
      </Box>
    );
  }

  return (
    <>
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

      <Grid container spacing={2}>
        {filteredPersonnel.length === 0 ? (
          <Grid item xs={12}>
            <Box textAlign="center" mt={4} p={3} bgcolor="white" borderRadius={2}>
              <Typography variant="body1" color="text.secondary">
                {searchTerm ? "No personnel match your search criteria" : "No personnel accounts found"}
              </Typography>
            </Box>
          </Grid>
        ) : (
          filteredPersonnel.map((person) => (
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
                  <Typography 
                    noWrap 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
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
                  {/* Personal Information Section */}
                  <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                    <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0.5
                    }}>
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                            <PersonIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                          </Box>
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
                      
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                          </Box>
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
                  
                  {/* Account Details Section */}
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
                          <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                            <BadgeIcon sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                          </Box>
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
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box sx={{ flexShrink: 0, mr: 0.5 }}>
                            <AccountCircle sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.1 }} />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ 
                            minWidth: { xs: '40px', sm: '50px' },
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
                                px: 0.75,
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
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider />
                  
                  {/* Action Section */}
                  <Box sx={{ 
                    p: { xs: 1, sm: 1.5 },
                    display: 'flex', 
                    justifyContent: 'space-between',
                    bgcolor: '#f5f5f5'
                  }}>
                    <Button
                      startIcon={<DeleteIcon />}
                      onClick={() => deleteAccount(person.username)}
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#DB0606',
                        borderRadius: '16px',
                        '&:hover': { backgroundColor: '#b20000' },
                        width: '100%',
                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                        py: { xs: 0.5, sm: 0.75 }
                      }}
                    >
                      Delete Account
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
};

export default SKPersonnelList;