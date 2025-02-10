import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, CardMedia } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios'; 
import API_BASE_URL from '@/config/apiConfig';
const SkPersonnelForm = () => {
  const [personnel, setPersonnel] = useState([]); 
  const router = useRouter();

  useEffect(() => {
    const fetchPersonnel = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/sk_personnel`); 
        setPersonnel(response.data.retrieved_data); 
      } catch (error) {
        console.error("Error fetching personnel:", error); 
      }
    };

    fetchPersonnel(); 
  }, []); 

  const handleSubmit = async (id) => {
    const personnelData = personnel.find(person => person.id === id);
    try {
        const complaintId = 1; 
        const response = await axios.post(`http://127.0.0.1:8000/assign-complaint/${complaintId}`, {
            personnel_id: id
        });
        alert(`Complaint successfully assigned to ${personnelData.fullname}`);
    } catch (error) {
        console.error("Error assigning complaint:", error.response || error.message);
        alert("Error assigning complaint");
    }
};

  const handleReturn = () => {
    router.push('Admin_Form');
  };

  return (
    <Container maxWidth="md">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5">SK Personnel</Typography>
      </div>
      <Grid container spacing={3}>
        {personnel.map(person => (
          <Grid item xs={12} sm={6} md={4} key={person.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
              <CardMedia
                component="img"
                height="140"
                image="/images/profile.png" 
                alt={person.fullname}
              />
              <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <Typography variant="h6" gutterBottom>
                    SK Personnel
                  </Typography>
                  <Typography paragraph>
                    <strong>Name:</strong> {person.fullname}
                    <br/>
                    <strong>Contact Number:</strong> {person.contactnum}
                    <br/>
                    <strong>Username:</strong> {person.username}
                    <br/>
                    <strong>Role:</strong> {person.role}
                  </Typography>
                </div>
                <Button
                  onClick={() => handleSubmit(person.id)}
                  variant="contained"
                  fullWidth
                  sx={{
                    marginTop: 2,
                    backgroundColor: '#FF6A00', '&:hover': { backgroundColor: '#FF6A00',},
                  }}
                >
                  Submit
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SkPersonnelForm;
