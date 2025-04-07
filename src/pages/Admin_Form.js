import { useEffect, useState, useCallback } from 'react';
import {
    Container, Card, CardContent, Typography, Button, Grid, Box, Divider, Select, MenuItem, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar, TextField, FormControl, InputLabel, Menu,    
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleIcon from '@mui/icons-material/People';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LogoutIcon from '@mui/icons-material/Logout';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';
import SKPersonnelAccountForm from './sk_personel_account';
import SKPersonnelList from './edit_sk_account';
import ArchivedComplaints from './ArchivedComplaints';
import EmergencyComplaints from './Emergencycomplaints';
import IssuedTickets from './issued_tickets';
import ResolvedComplaints from './resolved_complaints';
import DismissedComplaints from './dismissed_complaints';
import VerifyCommuterAccs from './verifycommuteraccs';
import ArchivedEmergencyComplaints from './ArchivedEmergencycomplaints'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import API_BASE_URL from '@/config/apiConfig';
import moment from 'moment';



const AdminForm = () => {
    const [complaints, setComplaints] = useState([]);
    const [archivedComplaints, setArchivedComplaints] = useState([]);
    const [personnelList, setPersonnelList] = useState([]);
    const [selectedComplaintId, setSelectedComplaintId] = useState(null);
    const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [successMessageAssign, setSuccessMessageAssign] = useState(null);
    const [successMessageArchive, setSuccessMessageArchive] = useState(null);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [showPersonnelForm, setShowPersonnelForm] = useState(false);
    const [showPersonnelList, setShowPersonnelList] = useState(false);
    const [showComplaints, setShowComplaints] = useState(true);
    const [showArchivedComplaints, setShowArchivedComplaints] = useState(false);
    const [showEmergencyComplaints, setShowEmergencyComplaints] = useState(false);
    const [emergencyComplaints] = useState([]);
    const [archivedEmergencyComplaints] = useState([]);
    const [verifycommuteraccs] =useState([]);
    const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
    const [loadingReports, setLoadingReports] = useState(true);
    const [successMessageSMS, setSuccessMessageSMS] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [message, setMessage] = useState("");
    const [complaintId, setComplaintId] = useState(null);
    const [showArchivedEmergencyComplaints, setShowArchivedEmergencyComplaints] = useState(false);
    const [loadingPersonnel, setLoadingPersonnel] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showCategoryButtons, setShowCategoryButtons] = useState(true);
    const [complaintsAnchorEl, setComplaintsAnchorEl] = useState(null);
    const [resolvedComplaints, setResolvedComplaints] = useState([]);
    const [dismissedComplaints, setDismissedComplaints] = useState([]);
    const [issuedTickets, setIssuedTickets] = useState([]);
    const [showIssuedTickets, setShowIssuedTickets] = useState(false);
    const [showResolvedComplaints, setShowResolvedComplaints] = useState(false);
    const [showDismissedComplaints, setShowDismissedComplaints] = useState(false);
    const [showVerifyCommuterAccs, setShowVerifyCommuterAccs] =useState(false);
    const router = useRouter();


    const fetchDriverDetails = useCallback(async (franchise_plate_no) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/driver-info/${franchise_plate_no}`);
            return response.data.data; // Ensure this matches the structure of your response
        } catch (error) {
            console.error("Error fetching driver details:", error);
            return null;
        }
    }, []);

    const fetchReports = useCallback(async (lastUpdated = null, category = '') => {
        try {
            const response = await axios.get(`${API_BASE_URL}/commuterreports`, {
                params: { 
                    last_updated: lastUpdated, // Include the lastUpdated parameter
                    category: category,       // Include the category parameter
                },
            });
            console.log('Fetched Reports:', response.data.retrieved_data); // Log the entire response
    
            const reportsWithDriverDetails = await Promise.all(
                response.data.retrieved_data.map(async (complaint) => {
                    // Ensure `contactnum` is part of the complaint object or set a default value
                    if (!complaint.contactNumber) {
                        console.warn('Missing contactnum for complaint', complaint);
                        complaint.contactNumber = ''; // Set a default value (e.g., empty string)
                    }
    
                    if (complaint.franchise_plate) {
                        const driverDetails = await fetchDriverDetails(complaint.franchise_plate);
                        return { ...complaint, driverDetails };
                    }
                    return complaint;
                })
            );
    
            // If it's the first fetch, replace; otherwise, merge new reports
            setComplaints((prevComplaints) => [
                ...reportsWithDriverDetails,
                ...prevComplaints.filter(
                    (prev) => !reportsWithDriverDetails.some((newRep) => newRep.id === prev.id)
                ),
            ]);
    
            // Return the last updated timestamp from the response
            return response.data.last_updated;
        } catch (error) {
            console.error("Error fetching reports:", error);
            return null; // Return null in case of an error
        } finally {
            setLoadingReports(false);
        }
    }, [fetchDriverDetails]);
    
    

    const handleNotifyClick = (id) => {
        setComplaintId(id); // Set the complaintId when Notify button is clicked
        setOpenDialog(true); // Open the dialog
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    
      const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const sendSMSNotification = async () => {
        if (!complaintId || !message) {
            console.error("Missing complaintId or message");
            setSuccessMessageSMS("Missing complaintId or message");
            return;
        }
    
        try {
            const response = await axios.post(
                `${API_BASE_URL}/notify-complainant/${complaintId}`,
                { message }
            );
    
            // Check if the response has success=true
            if (response.data?.success) {
                console.log("SMS sent successfully!");
                setSuccessMessageSMS("SMS sent successfully!");
                setOpenDialog(false); // Close the dialog after success
            } else {
                console.error("Failed to send SMS:", response.data?.message);
                setSuccessMessageSMS(`Failed to send SMS: ${response.data?.message}`);
            }
        } catch (error) {
            console.error("Error sending SMS:", error.response?.data || error.message);
            setSuccessMessageSMS(`Error sending SMS: ${error.response?.data?.message || error.message}`);
        }
    };
    
    
    
    const fetchArchivedComplaints = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/archived-complaints`);
            setArchivedComplaints(response.data.retrieved_data);
        } catch (error) {
            console.error("Error fetching archived complaints:", error);
        }
    }, []);

    const fetchPersonnelList = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/sk_personnel`);
            setPersonnelList(response.data.retrieved_data);
        } catch (error) {
            console.error("Error fetching personnel list:", error);
        } finally {
            setLoadingPersonnel(false);
        }
    }, []);

    const formatDateTime = (datetime) => {
        return moment(datetime).format('MM/DD/YYYY h:mm A'); // Format to include date and time
      };

    useEffect(() => {
        fetchPersonnelList();
        fetchArchivedComplaints();
        fetchReports();
        fetchIssuedTickets();
        fetchResolvedComplaints();
        fetchDismissedComplaints();

    
            const interval = setInterval(()=>{
                fetchReports();
                fetchArchivedComplaints();
                fetchPersonnelList();
            }, 2000);
    
            return () => clearInterval(interval);

            
    }, []);


    const handleComplaintsClose = () => {
        setComplaintsAnchorEl(null);
    };


    const handleAssignClick = (complaintId) => {
        setSuccessMessage(null);
        setSelectedComplaintId(complaintId);
        setOpenAssignDialog(true);
    };

    const closeNotification = () => {
        setSuccessMessageAssign(null);
        setSuccessMessageArchive(null);
        setSuccessMessageSMS(null);
    };

    const handlePersonnelSelect = (event) => {
        setSelectedPersonnelId(event.target.value);
    };

    const assignComplaint = async () => {
        if (!selectedPersonnelId) {
            setErrorMessage('Please select an SK personnel.');
            return;
        }
    
        try {
            // Assign the complaint to the personnel and send SMS notification
            const assignResponse = await axios.post(`${API_BASE_URL}/assign-complaint/${selectedComplaintId}`, {
                personnelId: selectedPersonnelId
            });
    
            if (assignResponse.data.success) {
                setSuccessMessageAssign('Complaint assigned and SK personnel notified successfully.');
                setOpenAssignDialog(false);
            } else {
                setErrorMessage('Failed to assign complaint.');
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.error || 'An error occurred.');
        }
    };

    const handleArchiveComplaint = async (complaintId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/archive-complaint/${complaintId}`);
        if (response.status === 200) {
            setSuccessMessageArchive("Complaint successfully archived.");
            setErrorMessage(null);
            // Refresh the complaints list after archiving
            fetchReports();
            fetchArchivedComplaints();  
        } else {
            setErrorMessage("Error archiving complaint.");
        }
    } catch (error) {
        console.error("Error archiving complaint:", error);
        setErrorMessage("Error archiving complaint. Please try again.");
    } finally {
        setOpenArchiveDialog(false); // Close confirmation dialog
    }
};
const fetchResolvedComplaints = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/resolved-reports`);
        const data = await response.json();
        setResolvedComplaints(data.resolved_complaints);
    } catch (error) {
        console.error("Error fetching resolved complaints:", error);
    }
};

const fetchDismissedComplaints = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/dismissed-reports`);
        const data = await response.json();
        setDismissedComplaints(data.dismissed_complaints);
    } catch (error) {
        console.error("Error fetching dismissed complaints:", error);
    }
};

const fetchIssuedTickets = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/issued-tickets`);
        const data = await response.json();
        setIssuedTickets(data.issued_tickets);
    } catch (error) {
        console.error("Error fetching issued tickets:", error);
    }
};
const handleShowVerifyCommuterAccs = () => {
    setShowVerifyCommuterAccs(true)
    setShowArchivedEmergencyComplaints(false);
    setShowComplaints(false);
    setShowEmergencyComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleShowArchivedEmergencyComplaints = () => {
    setShowVerifyCommuterAccs(false)
    setShowArchivedEmergencyComplaints(true);
    setShowComplaints(false);
    setShowEmergencyComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleShowPersonnelForm = () => {
    setShowVerifyCommuterAccs(false)
    setShowPersonnelForm(true);
    setShowPersonnelList(false);
    setShowComplaints(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleShowPersonnelList = () => {
    setShowVerifyCommuterAccs(false)
    setShowPersonnelList(true);
    setShowPersonnelForm(false);
    setShowComplaints(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleComplaintsClick = (event) => {
    setShowVerifyCommuterAccs(false)
    setShowComplaints(true);
    setComplaintsAnchorEl(event.currentTarget);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleShowEmergencyComplaints = () => {
    setShowVerifyCommuterAccs(false)
    setShowComplaints(false);
    setShowArchivedComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowEmergencyComplaints(true);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

const handleShowArchivedComplaints = () => {
    setShowVerifyCommuterAccs(false)
    setShowArchivedComplaints(true);
    setShowComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowIssuedTickets(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

// Handler for Issued Tickets
const handleShowIssuedTickets = () => {
    setShowVerifyCommuterAccs(false)
    setShowIssuedTickets(true);
    setShowComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowDismissedComplaints(false);
    setShowResolvedComplaints(false);
};

// Handler for Dismissed Complaints
const handleShowDismissedComplaints = () => {
    setShowVerifyCommuterAccs(false)
    setShowDismissedComplaints(true);
    setShowIssuedTickets(false);
    setShowComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowResolvedComplaints(false);
};

// Handler for Resolved Complaints
const handleShowResolvedComplaints = () => {
    setShowVerifyCommuterAccs(false)
    setShowResolvedComplaints(true);
    setShowIssuedTickets(false);
    setShowComplaints(false);
    setShowPersonnelForm(false);
    setShowPersonnelList(false);
    setShowArchivedComplaints(false);
    setShowEmergencyComplaints(false);
    setShowArchivedEmergencyComplaints(false);
    setShowCategoryButtons(false);
    setShowDismissedComplaints(false);
};

    const confirmArchiveComplaint = (complaintId) => {
        setSuccessMessage(null);
        setSelectedComplaintId(complaintId);
        setOpenArchiveDialog(true); // Open confirmation dialog
    };
    const handleLogout = () => {
        router.push('/Admin_Login');
    };


    return (
        <Box display="flex" minHeight="100vh" overflow="hidden">
            {/* Sidebar */}
            
         <Box
            width="240px"
            bgcolor="#FF7A00"
            color="#FFFFFF"
            display="flex"
            flexDirection="column"
            alignItems="center"
            paddingTop={4}
            sx={{
                flexShrink: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 1000,
            }}
        >
            <Box mb={2} textAlign="center">
                <Image src="/images/sklogo3.png" alt="Logo" width={80} height={80} />
                <Image src="/images/SK3.png" alt="Logo" width={80} height={80} />
                <Typography variant="h6">Admin Dashboard</Typography>
            </Box>

            {/* Complaints Dropdown Button */}
            <Button
                startIcon={<AccountCircleIcon />}
                endIcon={<ExpandMoreIcon />}
                sx={{
                    width: '80%',
                    justifyContent: 'space-between',
                    marginBottom: 2,
                    backgroundColor: '#FFA726',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#FB8C00' },
                }}
                onClick={handleComplaintsClick}
            >
                Complaints
            </Button>

 {/* Complaints Dropdown Menu */}
<Menu
    anchorEl={complaintsAnchorEl}
    open={Boolean(complaintsAnchorEl)}
    onClose={handleComplaintsClose}
    sx={{ width: '220px' }}
>
    <MenuItem onClick={() => { 
        setSelectedCategory(''); 
        fetchReports(null, ''); // Fetch all complaints
        handleComplaintsClose(); 
    }}>
        All Complaints
    </MenuItem>
    <MenuItem onClick={() => { 
        setSelectedCategory('Overcharging'); 
        fetchReports(null, 'Overcharging'); // Fetch complaints for Overcharging
        handleComplaintsClose(); 
    }}>
        Overcharging
    </MenuItem>
    <MenuItem onClick={() => { 
        setSelectedCategory('Assault'); 
        fetchReports(null, 'Assault'); // Fetch complaints for Assault
        handleComplaintsClose(); 
    }}>
        Assault
    </MenuItem>
    <MenuItem onClick={() => { 
        setSelectedCategory('Lost Belonging'); 
        fetchReports(null, 'Lost Belonging'); // Fetch complaints for Lost Belonging
        handleComplaintsClose(); 
    }}>
        Lost Belonging
    </MenuItem>
    <MenuItem onClick={() => { 
        handleShowEmergencyComplaints(); 
        handleComplaintsClose(); 
    }}>
        Emergency Complaints
    </MenuItem>

    {/* Added menu options for resolved complaints, issued tickets, and dismissed complaints outside the category */}
    <MenuItem onClick={() => { 
        handleShowResolvedComplaints(); // Fetch resolved complaints
        handleComplaintsClose(); 
    }}>
        Resolved Complaints
    </MenuItem>
    <MenuItem onClick={() => { 
        handleShowIssuedTickets(); // Fetch issued tickets
        handleComplaintsClose(); 
    }}>
        Issued Tickets
    </MenuItem>
    <MenuItem onClick={() => { 
        handleShowDismissedComplaints(); // Fetch dismissed complaints
        handleComplaintsClose(); 
    }}>
        Dismissed Complaints
    </MenuItem>
</Menu>
            {/* Archived Complaints */}
            <Button
                startIcon={<PeopleIcon />}
                sx={{
                    width: '80%',
                    justifyContent: 'flex-start',
                    marginBottom: 2,
                    backgroundColor: '#FFA726',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#FB8C00' },
                }}
                onClick={handleShowArchivedComplaints}
            >
                Archived Complaints
            </Button>

            {/* Archived Emergency Complaints */}
            <Button
                startIcon={<WarningIcon />}
                sx={{
                    width: '80%',
                    justifyContent: 'flex-start',
                    marginBottom: 2,
                    backgroundColor: '#FFA726',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#FB8C00' },
                }}
                onClick={handleShowArchivedEmergencyComplaints}
            >
                Archived Emergency Complaints
            </Button>

            <Button
                startIcon={<PeopleIcon />}
                sx={{ width: '80%', justifyContent: 'flex-start', marginBottom: 2, backgroundColor: '#FFA726', color: '#FFFFFF', textTransform: 'none', '&:hover': { backgroundColor: '#FB8C00' }, }}
                onClick={handleShowPersonnelForm}
            >
                Create an SK Personnel Account
            </Button>

            <Button
                startIcon={<ManageAccountsIcon />}
                sx={{ width: '80%', justifyContent: 'flex-start', marginBottom: 2, backgroundColor: '#FFA726', color: '#FFFFFF', textTransform: 'none', '&:hover': { backgroundColor: '#FB8C00' }, }}
                onClick={handleShowPersonnelList}
            >
                Manage SK Personnel Accounts
            </Button>

            <Button
                startIcon={<PeopleIcon />}
                sx={{ width: '80%', justifyContent: 'flex-start', marginBottom: 2, backgroundColor: '#FFA726', color: '#FFFFFF', textTransform: 'none', '&:hover': { backgroundColor: '#FB8C00' }, }}
                onClick={handleShowVerifyCommuterAccs}
            >
                Verify Commuter Accounts
            </Button>


            <Button
                startIcon={<LogoutIcon />}
                sx={{
                    width: '80%', justifyContent: 'flex-start', backgroundColor: '#FFA726', color: '#FFFFFF', textTransform: 'none', marginBottom: 2, '&:hover': { backgroundColor: '#FB8C00' }, position: 'sticky', bottom: 0, marginTop: 'auto',
                }}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
        
            {/* Main content */}
            
<Box component="main" sx={{ flexGrow: 1, overflowY: 'auto', padding: 4, paddingLeft: '240px' }}>
    <Container maxWidth="lg">
        <Grid container spacing={3} justifyContent="left"> {/* Centering grid items */}
            {showComplaints && loadingReports ? (
                <CircularProgress sx={{ marginTop: '20px' }} />
            ) : (
                showComplaints &&
                complaints
                    .filter((complaint) =>
                        selectedCategory === '' ? true : complaint.category === selectedCategory
                    ) // Filter based on selected category
                    .map((complaint) => (
                        <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" color="#FF6A00" gutterBottom>
                                        <strong>Complaint {complaint.id}</strong>
                                    </Typography>
                                    <Divider sx={{ marginBottom: 1 }} />
                                    <Typography><strong>Name:</strong> {complaint.fullName}</Typography>
                                    <Typography><strong>Contact #:</strong> {complaint.contactNumber}</Typography>
                                    <Typography><strong>Category:</strong> {complaint.category}</Typography>
                                    <Typography><strong>Incident Date and Time:</strong> {formatDateTime(complaint.incident_datetime)}</Typography>
                                    <Typography><strong>Location:</strong> {complaint.location}</Typography>
                                    <Typography><strong>Details:</strong> {complaint.complaintDetails}</Typography>
                                    <Typography><strong>Franchise plate number:</strong> {complaint.franchise_plate_no}</Typography>
                                    <Typography><strong>Status:</strong> {complaint.status}</Typography>
                                    <Typography><strong>Assigned to:</strong> {complaint.assigned_to_name}</Typography>
                                    {complaint.driver_info && complaint && (
                                        <>
                                            <Divider sx={{ marginTop: 2, marginBottom: 1 }} />
                                            <Typography variant="h6" color="primary">Tricycle Driver Details</Typography>
                                            <Typography><strong>Franchise Plate Number:</strong> {complaint.driver_info.franchise_plate_no}</Typography>
                                            <Typography><strong>Name:</strong> {complaint.driver_info.driver_name}</Typography>
                                            <Typography><strong>Association:</strong> {complaint.driver_info.association}</Typography>
                                            <Typography><strong>Address:</strong> {complaint.driver_info.address}</Typography>
                                            <Typography><strong>Ticket Count:</strong> {complaint.driver_info.ticket_count}</Typography>
                                        </>
                                        
                                    )} 
                                                                   
                                    <Box sx={{ marginTop: 'auto', textAlign: 'center', display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                        <Button
                                            onClick={() => handleAssignClick(complaint.id)}
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#FF6A00',
                                                borderRadius: '20px',
                                                padding: '3px 10px',
                                                '&:hover': { backgroundColor: '#FB8C00' },
                                            }}
                                        >
                                            Assign To
                                        </Button>
                                        <Button
                                            onClick={() => confirmArchiveComplaint(complaint.id)} // Call confirmArchiveComplaint here
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#0384fc',
                                                borderRadius: '20px',
                                                padding: '5px 15px',
                                                '&:hover': { backgroundColor: '#0384fc' },
                                            }}
                                        >
                                            Archive
                                        </Button>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleNotifyClick(complaint.id)}
                                            sx={{
                                                backgroundColor: '#fcdf03',
                                                borderRadius: '20px',
                                                padding: '3px 10px',
                                                '&:hover': { backgroundColor: '#fcdf03' },
                                            }}
                                        >
                                            Notify
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
            )}
                        {showVerifyCommuterAccs && (
                            <VerifyCommuterAccs VerifyCommuterAccs={verifycommuteraccs} />
                        )}
                        {/* Archived Emergency Complaints */}
                        {showArchivedEmergencyComplaints && (
                            <ArchivedEmergencyComplaints archivedEmergencyComplaints={archivedEmergencyComplaints} />
                        )}
                        {/* Show Emergency Complaints */}
                        {showEmergencyComplaints && (
                            <EmergencyComplaints emergencyComplaints={emergencyComplaints}/>
                        )}
                            {showArchivedComplaints && (
                            <ArchivedComplaints archivedComplaints={archivedComplaints} /> // Render ArchivedComplaints here
                        )}{showIssuedTickets && (
                            <IssuedTickets issuedTickets={issuedTickets} />
                        )}
                        
                        {/* Resolved Complaints */}
                        {showResolvedComplaints && (
                            <ResolvedComplaints resolvedComplaints={resolvedComplaints} />
                        )}
                        
                        {/* Dismissed Complaints */}
                        {showDismissedComplaints && (
                            <DismissedComplaints dismissedComplaints={dismissedComplaints} />
                        )}

                        {showPersonnelForm && <SKPersonnelAccountForm />}
                        {showPersonnelList && <SKPersonnelList />}
                        </Grid>
    </Container>
</Box>
                  {/* Dialog for sending notifications */}
                  <Dialog open={openDialog} onClose={handleCloseDialog}>
    <DialogTitle>Send Notification</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            label="Message"
            type="text"
            fullWidth
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
            Cancel
        </Button>
        <Button onClick={sendSMSNotification} color="primary">
            Send
        </Button>
    </DialogActions>
</Dialog>
            {/* Archive Complaint Dialog */}
<Dialog open={openArchiveDialog} onClose={() => setOpenArchiveDialog(false)}>
    <DialogTitle>Confirm Archive</DialogTitle>
    <DialogContent>
        <Typography>Are you sure you want to archive this complaint?</Typography>
        {successMessageArchive && (
            <Alert severity="success" sx={{ marginTop: 2 }}>
                {successMessageArchive}
            </Alert>
        )}
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenArchiveDialog(false)} color="secondary">Cancel</Button>
        <Button onClick={() => handleArchiveComplaint(selectedComplaintId)} color="primary">Confirm</Button>
    </DialogActions>
</Dialog>
            {/* Assign Complaint Dialog */}
            <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)}>
                <DialogTitle>Assign Complaint</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth
                        value={selectedPersonnelId}
                        onChange={handlePersonnelSelect}
                        displayEmpty
                        sx={{ marginBottom: 2 }}
                    >
                        <MenuItem value="" disabled>Select Personnel</MenuItem>
                        {personnelList.map((personnel) => (
                            <MenuItem key={personnel.id} value={personnel.id}>
                                {personnel.fullname}
                            </MenuItem>
                        ))}
                    </Select>
                    {errorMessage && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    {successMessageAssign && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {successMessageAssign}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAssignDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={assignComplaint} color="primary">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
             {/* Success Notifications */}
             <Snackbar
                open={!!successMessageAssign || !!successMessageArchive || !!successMessageSMS }
                autoHideDuration={4000}
                onClose={closeNotification}
                message={successMessageAssign || successMessageArchive || successMessageSMS}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default AdminForm;