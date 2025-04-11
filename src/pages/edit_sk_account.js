import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Box, Alert } from '@mui/material';
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
      const res = await axios.delete(`http://127.0.0.1:8000/delete_account/${username}`);
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
      <Typography variant="h4" gutterBottom>
        SK Personnel Accounts
      </Typography>

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
            <Card 
              sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: 'white' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {person.fullname}
                </Typography>
                <Typography paragraph>
                  Contact: {person.contactnum}
                </Typography>
                <Typography paragraph>
                  Username: {person.username}
                </Typography>
                <Typography paragraph>
                  Role: {person.role}
                </Typography>
                
                <Box sx={{ marginTop: 'auto' }}>
                  <Button 
                    onClick={() => deleteAccount(person.username)} 
                    variant="contained" 
                    fullWidth
                    sx={{
                      marginTop: 2,
                      backgroundColor: '#DB0606', '&:hover': { backgroundColor: '#DB0606',},
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
