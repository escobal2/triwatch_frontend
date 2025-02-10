import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useRouter } from 'next/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';
import API_BASE_URL from '@/config/apiConfig';

const SKPersonelForm = () => {
  const [reports, setReports] = useState([]);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('personnelId');
    router.push('sk_personel_login');
  };

  useEffect(() => {
    const fetchReports = async () => {
      const personnelId = localStorage.getItem('personnelId');
      if (!personnelId) {
        console.error("No personnel ID found");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/assigned-reports/${personnelId}`);
        setReports(response.data.retrieved_data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5">Assigned Commuter Reports</Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AccountCircleIcon style={{ marginRight: '10px' }} />
          <Button onClick={handleLogout} color="inherit" startIcon={<ExitToApp />}>Logout</Button>
        </div>
      </div>
      <Grid container spacing={3}>
        {reports.map(report => (
          <Grid item xs={12} sm={6} md={4} key={report.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: 'lightblue' }}>
              <CardContent>
                <div>
                  <Typography variant="h6" gutterBottom>
                    Complaint
                  </Typography>
                  <Typography paragraph>
                    {report.details}
                  </Typography>
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SKPersonelForm;
