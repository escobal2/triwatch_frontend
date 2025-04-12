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
import DeleteIcon from '@mui/icons-material/Delete';

const SKPersonnelList = () => {
  const [skPersonnel, setSKPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // Detect small screens for responsive design
  useEffect(() => {
    // Safe to use window here as this will only run client-side
    setIsSmallMobile(window.innerWidth < 400);
    
    const handleResize = () => {
      setIsSmallMobile(window.innerWidth < 400);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSKPersonnel = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/sk_personnel`);
      setSKPersonnel(response.data.retrieved_data);
    } catch (err) {
      setError("Failed to fetch SK personnel accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch data client-side
    if (typeof window !== 'undefined') {
      fetchSKPersonnel();
    }
  }, []);

  const deleteAccount = async (username) => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete this account? This action cannot be undone."
    );

    if (!confirmDeletion) return;

    try {
      const res = await axios.delete(`${API_BASE_URL}/delete_account/${username}`);
      setSuccessMessage(res.data.message);
      setSKPersonnel((prev) => prev.filter((person) => person.username !== username));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError("Error deleting account. Please try again.");
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
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

  const PersonnelCard = ({ person }) => (
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
        bgcolor: '#0384fc', 
        color: 'white', 
        py: { xs: 0.5, sm: 0.75 }, 
        px: { xs: 1, sm: 1.5 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography noWrap variant="subtitle1" fontWeight="bold" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
          {person.fullname}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: "#e3f2fd",
            color: "#0d47a1",
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
        {/* Personal Information */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Account Information
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
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
                  {person.username}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
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

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '60px', sm: '70px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  ID:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                >
                  #{person.id}
                </Typography>
              </Box>
            </Grid>
          </Grid>
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
            startIcon={<DeleteIcon sx={{ fontSize: '0.9rem' }} />}
            onClick={() => deleteAccount(person.username)}
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
            {!isSmallMobile ? 'Delete Account' : 'Delete'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom color="#0384fc" fontWeight="bold" sx={{ mb: 2 }}>
        SK Personnel Accounts
      </Typography>
      
      {successMessage && (
        <Box sx={{ 
          bgcolor: '#e8f5e9', 
          color: '#2e7d32', 
          p: 1.5, 
          borderRadius: '8px',
          mb: 2,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography variant="body2">{successMessage}</Typography>
        </Box>
      )}
      
      <Grid container spacing={2}>
        {skPersonnel.length === 0 ? (
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
                No SK personnel accounts found.
              </Typography>
            </Box>
          </Grid>
        ) : (
          skPersonnel.map((person) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
              <PersonnelCard person={person} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default SKPersonnelList;