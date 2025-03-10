import { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";
import API_BASE_URL from "@/config/apiConfig";

const VerifyCommuterAccs = () => {
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const approveCommuter = async (id) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/approve_account/${id}`);
      alert(res.data.message);
      setPendingAccounts((prev) => prev.filter((acc) => acc.id !== id));
    } catch (err) {
      alert("Error approving commuter. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Grid container spacing={3}>
      {pendingAccounts.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: 3 }}>
          No pending commuter accounts.
        </Typography>
      ) : (
        pendingAccounts.map((commuter) => (
          <Grid item xs={12} sm={6} md={4} key={commuter.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="#FF6A00" gutterBottom>
                  <strong>Commuter {commuter.id}</strong>
                </Typography>
                <Typography variant="body2">
                  <strong>Name: </strong>{commuter.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Username: </strong>{commuter.username}
                </Typography>
                <Typography variant="body2">
                  <strong>Contact Number: </strong>{commuter.contactnum}
                </Typography>
                <Typography variant="body2">
                  <strong>Valid ID:</strong>
                </Typography>
                <img 
  src={`${API_BASE_URL}/storage/${commuter.valid_id_path}`} 
  width="200px" 
  alt="Valid ID" 
  style={{ marginTop: "10px", borderRadius: "8px" }} 
/>
                <br />
                <Button 
                  onClick={() => approveCommuter(commuter.id)} 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Approve
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default VerifyCommuterAccs;
