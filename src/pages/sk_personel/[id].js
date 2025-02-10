import { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Grid, Divider, Box } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useRouter } from 'next/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Tesseract from "tesseract.js";
import axios from 'axios';

const SKPersonelForm = () => {
  const [complaints, setComplaints] = useState([]);
  const [image, setImage] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [extractedText, setExtractedText] = useState(null);
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const router = useRouter();
  const { id, fullname } = router.query;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/sk_personel_login');
  };

  // Fetch complaints assigned to SK personnel
  useEffect(() => {
    console.log("SK Personnel ID:", id);
    if (id) {
      const fetchComplaints = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/assigned-reports/${id}`);
          
          // Filter out complaints with status 'dismissed' or 'resolved'
          const filteredComplaints = response.data.retrieved_data?.filter(complaint => 
            complaint.status !== 'dismissed' && complaint.status !== 'resolved'
          ) || [];
  
          setComplaints(filteredComplaints);
        } catch (error) {
          console.error('Error fetching complaints:', error);
        }
      };
      fetchComplaints();
    }
  }, [id]);
  
  // Handle ticket image selection
  const handleImageChange = (e, complaintId) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setSelectedComplaintId(complaintId);
    }
  };

  const fetchSKPersonnel = async (personnelId) => {
    console.log("Fetching SK personnel for ID:", personnelId); // Debugging line
    if (!personnelId) {
      console.error("No personnel ID provided.");
      return null;
    }
    try {
      const response = await axios.get(`http://127.0.0.1:8000/sk_personnel/${personnelId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching SK personnel:", error.response?.data || error.message);
      return null;
    }
  };


  // Resolve Complaint (now includes ticket extraction)
  const resolveComplaint = async (complaintId, personnelId) => {
    const resolution = prompt("Enter resolution for this complaint:");
    if (!resolution) return;
  
    if (!image || selectedComplaintId !== complaintId) {
      alert("Please select an image for ticket extraction.");
      return;
    }
  
    try {
      // Extract ticket number using Tesseract OCR
      const { data: { text } } = await Tesseract.recognize(image, "eng", {
        logger: (m) => console.log(m),
      });
  
      console.log("Extracted Text:", text);
      const extractedTicketNumber = text.match(/\d+/)?.[0] || "N/A"; // Default to "N/A" if no number found
  
      setExtractedText(extractedTicketNumber);
      alert(`Extracted Ticket Number: ${extractedTicketNumber}`);
  
      // Fetch SK personnel details
      const skPersonnel = await fetchSKPersonnel(personnelId); 
      if (!skPersonnel) {
        alert("Failed to fetch SK personnel details.");
        return;
      }
  
      // Send resolution details along with SK personnel name
      const response = await axios.post(`http://127.0.0.1:8000/add-resolution/${complaintId}`, {
        resolution,
        ticket_number: extractedTicketNumber,
        resolved_by: skPersonnel.id,
        resolved_by_name: skPersonnel.fullname, // Send resolved by name
      });
  
      console.log('Complaint resolved:', response.data);
  
      // Update UI by removing the resolved complaint from the list
      setComplaints(complaints.filter(c => c.id !== complaintId));
      alert("Complaint resolved successfully!");
    } catch (error) {
      console.error("Error during resolution:", error);
      alert("An error occurred while resolving the complaint.");
    }
  };
  
  const dismissComplaint = async (complaintId, personnelId) => {
    const reason = prompt("Enter reason for dismissal:");
    if (!reason) {
      alert("Dismissal reason is required.");
      return;
    }
  
    // Fetch SK personnel details from backend
    const skPersonnel = await fetchSKPersonnel(personnelId);
  
    if (!skPersonnel) {
      alert("SK personnel not found.");
      return;
    }
  
    try {
      const response = await axios.post(`http://127.0.0.1:8000/dismiss-complaint/${complaintId}`, {
        dismiss_reason: reason,
        dismissed_by: skPersonnel.id, // Send ID
        dismissed_by_name: skPersonnel.fullname, // Send Name
      });
  
      alert(response.data.message);
      // Update UI: Move complaint to dismissed list
      setComplaints(prev => prev.filter(c => c.id !== complaintId));
      setDismissedComplaints(prev => [...prev, { ...response.data, id: complaintId }]);
  
    } catch (error) {
      console.error("Error during dismissal:", error.response?.data || error.message);
      alert("Failed to dismiss complaint.");
    }
  };
  
  
  
  
  

  return (
    <Container maxWidth="md" sx={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h5">Assigned Complaints for SK Personnel </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AccountCircleIcon style={{ marginRight: '10px' }} />
          <Button onClick={handleLogout} color="inherit" startIcon={<ExitToApp />}>Logout</Button>
        </div>
      </div>
      <Grid container spacing={3}>
        {complaints.map(complaint => (
          <Grid item xs={12} sm={6} md={4} key={complaint.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Complaint {complaint.id}</Typography>
                <Typography><strong>Name:</strong> {complaint.fullName}</Typography>
                <Typography><strong>Contact #:</strong> {complaint.contactNumber}</Typography>
                <Typography><strong>Category:</strong> {complaint.category}</Typography>
                <Typography><strong>Incident Date and Time:</strong> {complaint.incident_datetime}</Typography>
                <Typography><strong>Location:</strong> {complaint.location}</Typography>
                <Typography><strong>Details:</strong> {complaint.complaintDetails}</Typography>
                <Typography><strong>Franchise plate number:</strong> {complaint.franchise_plate_no}</Typography>

                {complaint.driver_info && (() => {
  let driverInfo;
  try {
    driverInfo = JSON.parse(complaint.driver_info);
  } catch (error) {
    console.error("Error parsing driver_info:", error);
    driverInfo = null;
  }

  return driverInfo ? (
    <>
      <Divider sx={{ marginTop: 2, marginBottom: 1 }} />
      <Typography variant="h6" color="primary">Tricycle Driver Details</Typography>
      <Typography><strong>Franchise Plate Number:</strong> {driverInfo.franchise_plate_no}</Typography>
      <Typography><strong>Name:</strong> {driverInfo.driver_name}</Typography>
      <Typography><strong>Association:</strong> {driverInfo.association}</Typography>
      <Typography><strong>Address:</strong> {driverInfo.address}</Typography>
    </>
  ) : null;
})()}

                {extractedText && (
                  <Typography variant="body1" color="primary">
                    Extracted Ticket Number: {extractedText}
                  </Typography>
                )}

                <Divider sx={{ marginTop: 2 }} />
                <Typography variant="h6" color="primary">Upload Ticket Image</Typography>
                <input
                  accept="image/*"
                  type="file"
                  capture="camera"
                  onChange={(e) => handleImageChange(e, complaint.id)}
                  style={{ marginBottom: '10px' }}
                />
                {image && selectedComplaintId === complaint.id && (
                  <img src={URL.createObjectURL(image)} alt="Ticket Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginTop: '10px' }} />
                )}

                {/* Resolve & Dismiss Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button variant="contained" color="success" onClick={() => resolveComplaint(complaint.id, id)}>Resolve</Button>
                  <Button variant="contained" color="error" onClick={() => dismissComplaint(complaint.id, id)}>Dismiss</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SKPersonelForm;
