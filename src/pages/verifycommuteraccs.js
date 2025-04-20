import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Divider 
} from "@mui/material";
import API_BASE_URL from "@/config/apiConfig";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const VerifyCommuterAccs = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSmallMobile, setIsSmallMobile] = useState(false); // Default value without window

  // Detect small screens for responsive design - moved inside useEffect
  useEffect(() => {
    // Safe to use window here as this will only run client-side
    setIsSmallMobile(window.innerWidth < 400);
    
    const handleResize = () => {
      setIsSmallMobile(window.innerWidth < 400);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPendingAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/pending_accounts`);
      // Make sure we're handling the response correctly - Extract the pending_accounts array
      const accounts = res.data.pending_accounts || [];
      setPendingAccounts(accounts);
    } catch (err) {
      console.error("Error fetching pending accounts:", err);
      setError("Failed to fetch pending accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data client-side
    if (typeof window !== 'undefined') {
      fetchPendingAccounts(); // Initial fetch

      const interval = setInterval(() => {
        fetchPendingAccounts(); 
      }, 3000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, []);

  // Approve Function
  const approveCommuter = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/approve_account/${id}`);
      alert(res.data.message);
      setPendingAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      alert("Error approving commuter. Please try again.");
    }
  };

  // Disapprove Function
  const disapproveCommuter = async (id) => {
    const confirmDisapproval = window.confirm(
      "Are you sure you want to disapprove this commuter? This action cannot be undone."
    );

    if (!confirmDisapproval) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/commuter/${id}/disapprove`);
      alert(res.data.message);
      setPendingAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      alert("Error disapproving commuter. Please try again.");
    }
  };

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100px'
    }}>
      <Typography variant="body1" color="text.secondary">Loading...</Typography>
    </Box>
  );
  
  if (error) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100px',
      color: 'error.main' 
    }}>
      <Typography variant="body1">{error}</Typography>
    </Box>
  );

  const CommuterCard = ({ commuter }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0 // Important for flex items
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
          Commuter #{commuter.id}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: "#ffcc80",
            color: "#e65100",
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
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Personal Information
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
                  {commuter.name}
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
                  {commuter.contactnum || 'Not provided'}
                </Typography>
              </Box>
            </Grid>

            {/* Added Email Field */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Email:
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
                  {commuter.email || 'Not provided'}
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
                  Username:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px',
                    wordBreak: 'break-word'
                  }}
                >
                  {commuter.username}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* ID Verification Section */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            ID Verification
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            mb: 1
          }}>
            {commuter.valid_id_path && (
              <Box 
                component="img"
                src={`${API_BASE_URL}/storage/${commuter.valid_id_path}`}
                alt="Valid ID"
                sx={{
                  width: '100%', 
                  maxWidth: '250px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              />
            )}
          </Box>
        </Box>
        
        <Divider />
        
        {/* Action buttons */}
        <Box sx={{ 
          p: { xs: 0.5, sm: 1 },
          display: 'flex', 
          gap: 0.5,
          justifyContent: 'space-between',
          bgcolor: '#f5f5f5'
        }}>
          <Button
            startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => approveCommuter(commuter.id)}
            variant="contained"
            color="primary"
            size="small"
            sx={{
              borderRadius: '16px',
              flexGrow: 1,
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              py: { xs: 0.5, sm: 0.75 },
              px: { xs: 0.5, sm: 1 },
              minWidth: 0,
              whiteSpace: 'nowrap',
              bgcolor: '#4caf50',
              '&:hover': { bgcolor: '#388e3c' }
            }}
          >
            {!isSmallMobile ? 'Approve' : ''}
          </Button>
          
          <Button
            startIcon={<CancelIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => disapproveCommuter(commuter.id)}
            variant="contained"
            color="error"
            size="small"
            sx={{
              borderRadius: '16px',
              flexGrow: 1,
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              py: { xs: 0.5, sm: 0.75 },
              px: { xs: 0.5, sm: 1 },
              minWidth: 0,
              whiteSpace: 'nowrap'
            }}
          >
            {!isSmallMobile ? 'Disapprove' : ''}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={2}>
      {Array.isArray(pendingAccounts) && pendingAccounts.length > 0 ? (
        pendingAccounts.map((commuter) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={commuter.id}>
            <CommuterCard commuter={commuter} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100px',
            bgcolor: '#f5f5f5',
            borderRadius: '8px',
            p: 2,
            mt: 2
          }}>
            <Typography variant="body1" color="text.secondary">
              No pending commuter accounts to verify.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default VerifyCommuterAccs;