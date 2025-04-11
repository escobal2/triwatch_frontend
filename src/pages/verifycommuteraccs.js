import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider,
  CircularProgress
} from "@mui/material";
import { Person, CheckCircle, Cancel, Badge } from "@mui/icons-material";
import API_BASE_URL from "@/config/apiConfig";

const VerifyCommuterAccs = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingIds, setProcessingIds] = useState([]);

  const fetchPendingAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pending_accounts`);
      setPendingAccounts(res.data);
    } catch (err) {
      setError("Failed to fetch pending accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAccounts(); // Initial fetch

    const interval = setInterval(() => {
      fetchPendingAccounts(); 
    }, 3000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Approve Function
  const approveCommuter = async (id) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      const res = await axios.post(`${API_BASE_URL}/approve_account/${id}`);
      setPendingAccounts((prev) => prev.filter((acc) => acc.id !== id));
      alert(res.data.message);
    } catch (err) {
      alert("Error approving commuter. Please try again.");
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  // Disapprove Function
  const disapproveCommuter = async (id) => {
    const confirmDisapproval = window.confirm(
      "Are you sure you want to disapprove this commuter? This action cannot be undone."
    );

    if (!confirmDisapproval) return;

    setProcessingIds(prev => [...prev, id]);
    try {
      const res = await axios.delete(`${API_BASE_URL}/commuter/${id}/disapprove`);
      setPendingAccounts((prev) => prev.filter((acc) => acc.id !== id));
      alert(res.data.message);
    } catch (err) {
      alert("Error disapproving commuter. Please try again.");
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: '#FF6A00' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box 
        sx={{ 
          bgcolor: '#ffebee', 
          p: 2, 
          borderRadius: 2, 
          border: '1px solid #ef9a9a', 
          color: '#c62828',
          my: 2
        }}
      >
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {pendingAccounts.length === 0 ? (
        <Grid item xs={12}>
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4, 
              px: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 2,
              border: '1px dashed #bdbdbd'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No pending commuter accounts to verify.
            </Typography>
          </Box>
        </Grid>
      ) : (
        pendingAccounts.map((commuter) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={commuter.id}>
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
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}
                >
                  Commuter #{commuter.id}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: '#ffcc80',
                    color: '#e65100',
                    px: 1,
                    py: 0.25,
                    ml: 0.5,
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' },
                    whiteSpace: 'nowrap'
                  }}
                >
                  Pending
                </Typography>
              </Box>

              <CardContent sx={{ 
                flexGrow: 1, 
                p: 0, 
                "&:last-child": { pb: 0 },
                overflowY: 'auto'
              }}>
                {/* Personal Information */}
                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                  <Typography 
                    variant="subtitle2" 
                    color="#0384fc" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Person sx={{ fontSize: '1rem', mr: 0.5 }} /> Personal Info
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '70px', sm: '80px' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Full Name:
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
                          {commuter.name}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '70px', sm: '80px' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Username:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium" 
                          sx={{ 
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '100%'
                          }}
                        >
                          {commuter.username}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ 
                          minWidth: { xs: '70px', sm: '80px' },
                          flexShrink: 0,
                          pt: 0.1
                        }}>
                          Contact:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          fontWeight="medium" 
                          sx={{ 
                            fontFamily: 'monospace',
                            letterSpacing: '0.5px'
                          }}
                        >
                          {commuter.contactnum}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Divider />
                
                {/* ID Verification Section */}
                <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
                  <Typography 
                    variant="subtitle2" 
                    color="#0384fc" 
                    fontWeight="bold" 
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.85rem' },
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Badge sx={{ fontSize: '1rem', mr: 0.5 }} /> Identification
                  </Typography>
                  
                  <Box sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 1,
                    position: 'relative'
                  }}>
                    <Box
                      component="img"
                      src={`${API_BASE_URL}/storage/${commuter.valid_id_path}`}
                      alt="Valid ID"
                      sx={{
                        width: '100%',
                        maxHeight: { xs: '150px', sm: '180px' },
                        objectFit: 'contain',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '5px',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        fontSize: '10px',
                        px: 0.5,
                        py: 0.25,
                        borderRadius: '4px'
                      }}
                    >
                      Valid ID
                    </Box>
                  </Box>
                </Box>
                
                <Divider />
                
                {/* Actions Section */}
                <Box sx={{ 
                  p: { xs: 1, sm: 1.5 }, 
                  bgcolor: '#e3f2fd',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 1
                }}>
                  <Button
                    onClick={() => approveCommuter(commuter.id)}
                    variant="contained"
                    disabled={processingIds.includes(commuter.id)}
                    startIcon={processingIds.includes(commuter.id) ? 
                      <CircularProgress size={16} color="inherit" /> : 
                      <CheckCircle sx={{ fontSize: '0.9rem' }} />
                    }
                    sx={{
                      backgroundColor: '#4caf50',
                      '&:hover': { backgroundColor: '#388e3c' },
                      flex: 1,
                      borderRadius: '8px',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {processingIds.includes(commuter.id) ? 'Processing...' : 'Approve'}
                  </Button>
                  
                  <Button
                    onClick={() => disapproveCommuter(commuter.id)}
                    variant="contained"
                    disabled={processingIds.includes(commuter.id)}
                    startIcon={processingIds.includes(commuter.id) ? 
                      <CircularProgress size={16} color="inherit" /> : 
                      <Cancel sx={{ fontSize: '0.9rem' }} />
                    }
                    sx={{
                      backgroundColor: '#f44336',
                      '&:hover': { backgroundColor: '#d32f2f' },
                      flex: 1,
                      borderRadius: '8px',
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    {processingIds.includes(commuter.id) ? 'Processing...' : 'Disapprove'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default VerifyCommuterAccs;