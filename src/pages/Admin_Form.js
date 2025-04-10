import { useState, useEffect, useCallback } from 'react';
import { 
  Box, Typography, Button, Grid, Card, CardContent, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, Alert, Snackbar, Divider,
  CircularProgress, InputBase, IconButton, Drawer, useMediaQuery,
  useTheme, Arc
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import ArchiveIcon from '@mui/icons-material/Archive';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Icons - import only what's needed
import { 
  AccountCircle, People, ManageAccounts, Logout, Warning, 
  ExpandMore, ExpandLess, Search, Menu as MenuIcon, Close
} from '@mui/icons-material';

// Import components
import SKPersonnelAccountForm from './sk_personel_account';
import SKPersonnelList from './edit_sk_account';
import ArchivedComplaints from './ArchivedComplaints';
import EmergencyComplaints from './Emergencycomplaints';
import IssuedTickets from './issued_tickets';
import ResolvedComplaints from './resolved_complaints';
import DismissedComplaints from './dismissed_complaints';
import VerifyCommuterAccs from './verifycommuteraccs';
import ArchivedEmergencyComplaints from './ArchivedEmergencycomplaints';

import API_BASE_URL from '@/config/apiConfig';

const AdminDashboard = () => {
  // States - consolidated
  const [complaints, setComplaints] = useState([]);
  const [archivedComplaints, setArchivedComplaints] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [dismissedComplaints, setDismissedComplaints] = useState([]);
  const [issuedTickets, setIssuedTickets] = useState([]);
  
  // UI States
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [complaintsAnchorEl, setComplaintsAnchorEl] = useState(null);
  const [activeView, setActiveView] = useState('complaints');
  const [expandedMenu, setExpandedMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [expandedArchiveMenu, setExpandedArchiveMenu] = useState(false);
  const [expandedAccountsMenu, setExpandedAccountsMenu] = useState(false);
  
  // Mobile responsive states
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  // Dialog & Message States
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [openNotifyDialog, setOpenNotifyDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Loading States
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // API Call Functions
  const fetchDriverDetails = useCallback(async (franchisePlateNo) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/driver-info/${franchisePlateNo}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching driver details:", error);
      return null;
    }
  }, []);

  const fetchReports = useCallback(async (lastUpdated = null, category = '') => {
    try {
      const response = await axios.get(`${API_BASE_URL}/commuterreports`, {
        params: { last_updated: lastUpdated, category }
      });
      
      const reportsWithDriverDetails = await Promise.all(
        response.data.retrieved_data.map(async (complaint) => {
          if (!complaint.contactNumber) complaint.contactNumber = '';
          
          if (complaint.franchise_plate) {
            const driverDetails = await fetchDriverDetails(complaint.franchise_plate);
            return { ...complaint, driverDetails };
          }
          return complaint;
        })
      );
      
      setComplaints(prevComplaints => [
        ...reportsWithDriverDetails,
        ...prevComplaints.filter(prev => !reportsWithDriverDetails.some(newRep => newRep.id === prev.id))
      ]);
      
      return response.data.last_updated;
    } catch (error) {
      console.error("Error fetching reports:", error);
      return null;
    } finally {
      setLoadingReports(false);
    }
  }, [fetchDriverDetails]);

  // Consolidated data fetching function
 

  // Simplified data fetching functions
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

  const fetchResolvedComplaints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resolved-reports`);
      setResolvedComplaints(response.data.resolved_complaints);
    } catch (error) {
      console.error("Error fetching resolved complaints:", error);
    }
  };

  const fetchDismissedComplaints = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/dismissed-reports`);
      setDismissedComplaints(response.data.dismissed_complaints);
    } catch (error) {
      console.error("Error fetching dismissed complaints:", error);
    }
  };

  const fetchIssuedTickets = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/issued-tickets`);
      setIssuedTickets(response.data.issued_tickets);
    } catch (error) {
      console.error("Error fetching issued tickets:", error);
    }
  };

  // Action Functions (consolidated)
  const handleAction = {
    assign: (complaintId) => {
      setSuccessMessage(null);
      setSelectedComplaintId(complaintId);
      setOpenAssignDialog(true);
    },
    archive: (complaintId) => {
      setSuccessMessage(null);
      setSelectedComplaintId(complaintId);
      setOpenArchiveDialog(true);
    },
    notify: (complaintId) => {
      setSelectedComplaintId(complaintId);
      setOpenNotifyDialog(true);
    },
    view: (view) => {
      setActiveView(view);
      setComplaintsAnchorEl(null);
      setExpandedMenu(false);
      if (isMobile) setMobileDrawerOpen(false);
    },
    category: (category = '') => {
      setSelectedCategory(category);
      fetchReports(null, category);
      setActiveView('complaints');
      setComplaintsAnchorEl(null);
      setExpandedMenu(false);
      if (isMobile) setMobileDrawerOpen(false);
    },
    // In your handleAction object, update these functions:
toggleArchiveMenu: () => {
  setExpandedArchiveMenu(!expandedArchiveMenu);
  // Don't change activeView here - just toggle the menu
},
toggleAccountsMenu: () => {
  setExpandedAccountsMenu(!expandedAccountsMenu);
  // Don't change activeView here - just toggle the menu
},
    logout: () => router.push('/Admin_Login'),
    toggleMenu: () => setExpandedMenu(!expandedMenu),
    toggleDrawer: () => setMobileDrawerOpen(!mobileDrawerOpen),
    toggleMenu: () => setExpandedMenu(!expandedMenu),
    toggleDrawer: () => setMobileDrawerOpen(!mobileDrawerOpen)
  };

  // API Action Functions
  const assignComplaint = async () => {
    if (!selectedPersonnelId) {
      setErrorMessage('Please select an SK personnel.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/assign-complaint/${selectedComplaintId}`, {
        personnelId: selectedPersonnelId
      });
      if (response.data.success) {
        setSuccessMessage('Complaint assigned successfully.');
        setOpenAssignDialog(false);
        fetchReports();
      } else {
        setErrorMessage('Failed to assign complaint.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  const confirmArchiveComplaint = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/archive-complaint/${selectedComplaintId}`);
      if (response.status === 200) {
        setSuccessMessage("Complaint successfully archived.");
        setErrorMessage(null);
  
        // Optimistically update UI without needing to re-fetch
        setComplaints(prev => prev.filter(c => c.id !== selectedComplaintId));
  
        // Still fetch archived list to keep that up to date
        fetchArchivedComplaints();
      } else {
        setErrorMessage("Error archiving complaint.");
      }
    } catch (error) {
      console.error("Error archiving complaint:", error);
      setErrorMessage("Error archiving complaint. Please try again.");
    } finally {
      setOpenArchiveDialog(false);
    }
  };
  

  const sendSMSNotification = async () => {
    if (!selectedComplaintId || !message) {
      setErrorMessage("Missing complaintId or message");
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/notify-complainant/${selectedComplaintId}`,
        { message }
      );
      if (response.data?.success) {
        setSuccessMessage("SMS sent successfully!");
        setOpenNotifyDialog(false);
      } else {
        setErrorMessage(`Failed to send SMS: ${response.data?.message}`);
      }
    } catch (error) {
      setErrorMessage(`Error sending SMS: ${error.response?.data?.message || error.message}`);
    }
  };

  // Utilities
  const formatDateTime = (datetime) => moment(datetime).format('MM/DD/YYYY h:mm A');
  const closeNotification = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredComplaints(complaints);
      return;
    }
    
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = complaints.filter(complaint => 
      complaint.fullName?.toLowerCase().includes(searchTermLower) ||
      complaint.franchise_plate_no?.toLowerCase().includes(searchTermLower) ||
      complaint.location?.toLowerCase().includes(searchTermLower) ||
      complaint.category?.toLowerCase().includes(searchTermLower) ||
      complaint.complaintDetails?.toLowerCase().includes(searchTermLower) ||
      complaint.assigned_to_name?.toLowerCase().includes(searchTermLower) ||
      complaint.id?.toString().includes(searchTermLower)
    );
    
    setFilteredComplaints(filtered);
  }, [searchTerm, complaints]);

  // Effect Hook for data fetching
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

  // Component for Complaint Card - redesigned for better responsiveness
  const ComplaintCard = ({ complaint }) => (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
      borderRadius: '12px',
      overflow: 'hidden',
      minWidth: 0 // Important for flex items to allow shrinking below content size
    }}>
      {/* Card Header - Compact and responsive */}
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
          Complaint #{complaint.id}
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            bgcolor: complaint.status === 'Pending' ? '#ffcc80' : '#81c784',
            color: complaint.status === 'Pending' ? '#e65100' : '#2e7d32',
            px: 1,
            py: 0.25,
            ml: 0.5,
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: { xs: '0.6rem', sm: '0.7rem' },
            whiteSpace: 'nowrap'
          }}
        >
          {complaint.status}
        </Typography>
      </Box>
  
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 0, 
        "&:last-child": { pb: 0 }, // Remove default padding at bottom
        overflowY: 'auto' // Allow scrolling if content is too large
      }}>
        {/* Unified Grid approach for all sections */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Complainant
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {/* Two column layout that becomes single column on very small screens */}
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
                  {complaint.fullName}
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
                  {complaint.contactNumber || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Incident Details - Compact design */}
        <Box sx={{ p: { xs: 1, sm: 1.5 } }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Incident Details
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Type:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium"
                  sx={{
                    bgcolor: 
                      complaint.category === 'Assault' ? '#ffcdd2' : 
                      complaint.category === 'Overcharging' ? '#c8e6c9' : 
                      complaint.category === 'Lost Belonging' ? '#bbdefb' : '#e1f5fe',
                    px: 0.5,
                    py: 0.2,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%'
                  }}
                >
                  {complaint.category}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Date:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {formatDateTime(complaint.incident_datetime)}
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
                  Location:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    width: '100%'
                  }}
                >
                  {complaint.location}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Details:
              </Typography>
              <Box sx={{ 
                bgcolor: '#f5f5f5', 
                p: 1, 
                borderRadius: '4px', 
                maxHeight: { xs: '40px', sm: '50px', md: '60px' }, 
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                fontSize: { xs: '0.65rem', sm: '0.7rem' }
              }}>
                <Typography 
                  variant="caption" 
                  component="div"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {complaint.complaintDetails}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Vehicle/Driver Information - Streamlined */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: complaint.driver_info ? '#fff8e1' : 'transparent' }}>
          <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            mb: 0.5
          }}>
            Vehicle Info
          </Typography>
          
          <Grid container spacing={1} sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="caption" color="text.secondary" sx={{ 
                  minWidth: { xs: '40px', sm: '50px' },
                  flexShrink: 0,
                  pt: 0.1
                }}>
                  Plate:
                </Typography>
                <Typography 
                  variant="caption" 
                  fontWeight="medium" 
                  sx={{ 
                    fontFamily: 'monospace',
                    letterSpacing: '0.5px'
                  }}
                >
                  {complaint.franchise_plate_no || 'Not provided'}
                </Typography>
              </Box>
            </Grid>
            
            {/* Driver details if available - compressed */}
            {complaint.driver_info && (
              <>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '40px', sm: '50px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Driver:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%'
                      }}
                    >
                      {complaint.driver_info.driver_name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ 
                      minWidth: { xs: '45px', sm: '55px' },
                      flexShrink: 0,
                      pt: 0.1
                    }}>
                      Tickets:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight="medium"
                      sx={{
                        bgcolor: 
                          complaint.driver_info.ticket_count > 3 ? '#ffcdd2' : 
                          complaint.driver_info.ticket_count > 1 ? '#fff9c4' : '#e8f5e9',
                        px: 0.5,
                        py: 0.2,
                        borderRadius: '4px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {complaint.driver_info.ticket_count}
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Assignment Status - More compact */}
        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#e3f2fd' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              mb: 0
            }}>
              Assignment
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              bgcolor: complaint.assigned_to_name ? '#e8f5e9' : '#ffebee',
              px: 0.5,
              py: 0.25,
              borderRadius: '4px',
              maxWidth: '60%',
              overflow: 'hidden'
            }}>
              <AccountCircle sx={{ 
                fontSize: { xs: 12, sm: 14 }, 
                mr: 0.5, 
                color: complaint.assigned_to_name ? '#2e7d32' : '#c62828' 
              }} />
              <Typography 
                variant="caption" 
                fontWeight="medium" 
                sx={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: { xs: '0.65rem', sm: '0.7rem' }
                }}
              >
                {complaint.assigned_to_name || 'Not assigned'}
              </Typography>
            </Box>
          </Box>
        </Box>
          
        {/* Action buttons - optimized for space */}
        <Box sx={{ 
          p: { xs: 0.5, sm: 1 },
          display: 'flex', 
          gap: 0.5,
          justifyContent: 'space-between',
          bgcolor: '#f5f5f5'
        }}>
          {/* Filter buttons array based on assignment status */}
          {[
            // Only show Assign button if not already assigned
            ...(complaint.assigned_to_name ? [] : [{ 
              label: 'Assign', 
              action: () => handleAction.assign(complaint.id), 
              color: '#FF6A00', 
              hoverColor: '#FB8C00',
              icon: <ManageAccounts sx={{ fontSize: '0.9rem' }} />
            }]),
            { 
              label: 'Archive', 
              action: () => handleAction.archive(complaint.id), 
              color: '#0384fc', 
              hoverColor: '#0366d6',
              icon: <ArchiveIcon sx={{ fontSize: '0.9rem' }} />
            },
            { 
              label: 'Notify', 
              action: () => handleAction.notify(complaint.id), 
              color: '#fcdf03', 
              hoverColor: '#e6cc00',
              icon: <NotificationsIcon sx={{ fontSize: '0.9rem' }} />
            }
          ].map((btn, idx) => (
            <Button
              key={idx}
              startIcon={btn.icon}
              onClick={btn.action}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: btn.color,
                borderRadius: '16px',
                '&:hover': { backgroundColor: btn.hoverColor },
                flexGrow: 1,
                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                py: { xs: 0.5, sm: 0.75 },
                px: { xs: 0.5, sm: 1 },
                minWidth: 0,
                whiteSpace: 'nowrap'
              }}
            >
              {!isSmallMobile ? btn.label : ''}
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
  // Navigation menu item renderer - works for both desktop and mobile
  const renderMenuItem = (icon, label, view, endIcon = null) => (
    <Button
      startIcon={icon}
      endIcon={endIcon}
      sx={{
        justifyContent: endIcon ? 'space-between' : 'flex-start',
        bgcolor: activeView === view ? '#005776' : 'transparent',
        color: 'white',
        '&:hover': { bgcolor: '#005776' },
        textAlign: 'left',
        pl: 2,
        borderRadius: 0,
        mb: 0,
        py: 1.5,
        width: '100%',
        textTransform: 'none',
        whiteSpace: 'nowrap'
      }}
      onClick={() => {
        if (endIcon) {
          // Only toggle the menu without changing view
          if (label === "Complaints") handleAction.toggleMenu();
          else if (label === "Archives") handleAction.toggleArchiveMenu();
          else if (label === "Personnel Management") handleAction.toggleAccountsMenu();
        } else if (view) {
          // Change the view
          handleAction.view(view);
        }
      }}
    >
      {label}
    </Button>
  );

  // Sidebar content - reused in both permanent sidebar and mobile drawer
  const sidebarContent = (
    <>
      {/* Logo and Title */}
      <Box p={2} textAlign="center" sx={{ bgcolor: '#2c3e50' }}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          <Image src="/images/sklogo3.png" alt="Logo" width={isMobile ? 40 : 60} height={isMobile ? 40 : 60} />
          <Typography 
            variant={isMobile ? "h5" : "h4"}
            sx={{ 
              ml: 1, 
              fontWeight: 'bold', 
              color: '#13a0c7', 
              letterSpacing: 1 
            }}
          >
            SK<span style={{ color: 'red' }}>3</span>
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: '#ccc', fontSize: isMobile ? '10px' : '12px', mt: -1 }}>
          Seguridad Kaayusan<br />
          Katrangquilohan<br />
          Kauswagan
        </Typography>
      </Box>
      
      {/* Navigation Menu - FIXED */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'auto' }}>
        {/* Note: Empty string for view parameter on dropdown menus */}
        {renderMenuItem(<AccountCircle />, "Complaints", "", expandedMenu ? <ExpandLess /> : <ExpandMore />)}
        
        {/* Complaints submenu */}
        <Box sx={{ display: expandedMenu ? 'block' : 'none', bgcolor: '#253649' }}>
          {[
            { label: 'All Complaints', action: () => handleAction.category('') },
            { label: 'Overcharging', action: () => handleAction.category('Overcharging') },
            { label: 'Assault', action: () => handleAction.category('Assault') },
            { label: 'Lost Belonging', action: () => handleAction.category('Lost Belonging') },
            { label: 'Emergency Complaints', action: () => handleAction.view('emergency') },
            { label: 'Resolved Complaints', action: () => handleAction.view('resolved') },
            { label: 'Issued Tickets', action: () => handleAction.view('tickets') },
            { label: 'Dismissed Complaints', action: () => handleAction.view('dismissed') }
          ].map((item, idx) => (
            <Button 
              key={idx}
              onClick={item.action}
              sx={{ 
                color: '#ccc',
                justifyContent: 'flex-start',
                width: '100%',
                textTransform: 'none',
                pl: 4,
                py: 1,
                borderRadius: 0,
                '&:hover': { bgcolor: '#1a2530', color: 'white' }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        
        {/* Archives dropdown - FIXED */}
        {renderMenuItem(<ArchiveIcon />, "Archives", "", expandedArchiveMenu ? <ExpandLess /> : <ExpandMore />)}
        <Box sx={{ display: expandedArchiveMenu ? 'block' : 'none', bgcolor: '#253649' }}>
          <Button 
            onClick={() => handleAction.view("archived")}
            sx={{ 
              color: '#ccc',
              justifyContent: 'flex-start',
              width: '100%',
              textTransform: 'none',
              pl: 4,
              py: 1,
              borderRadius: 0,
              '&:hover': { bgcolor: '#1a2530', color: 'white' }
            }}
          >
            Archived Complaints
          </Button>
          <Button 
            onClick={() => handleAction.view("archivedEmergency")}
            sx={{ 
              color: '#ccc',
              justifyContent: 'flex-start',
              width: '100%',
              textTransform: 'none',
              pl: 4,
              py: 1,
              borderRadius: 0,
              '&:hover': { bgcolor: '#1a2530', color: 'white' }
            }}
          >
            Archived Emergency
          </Button>
        </Box>

        {/* Personnel Management dropdown - FIXED */}
        {renderMenuItem(<People />, "Personnel Management", "", expandedAccountsMenu ? <ExpandLess /> : <ExpandMore />)}
        <Box sx={{ display: expandedAccountsMenu ? 'block' : 'none', bgcolor: '#253649' }}>
          <Button 
            onClick={() => handleAction.view("createPersonnel")}
            sx={{ 
              color: '#ccc',
              justifyContent: 'flex-start',
              width: '100%',
              textTransform: 'none',
              pl: 4,
              py: 1,
              borderRadius: 0,
              '&:hover': { bgcolor: '#1a2530', color: 'white' }
            }}
          >
            Create SK Personnel
          </Button>
          <Button 
            onClick={() => handleAction.view("managePersonnel")}
            sx={{ 
              color: '#ccc',
              justifyContent: 'flex-start',
              width: '100%',
              textTransform: 'none',
              pl: 4,
              py: 1,
              borderRadius: 0,
              '&:hover': { bgcolor: '#1a2530', color: 'white' }
            }}
          >
            Manage SK Personnel
          </Button>
          <Button 
            onClick={() => handleAction.view("verifyCommuter")}
            sx={{ 
              color: '#ccc',
              justifyContent: 'flex-start',
              width: '100%',
              textTransform: 'none',
              pl: 4,
              py: 1,
              borderRadius: 0,
              '&:hover': { bgcolor: '#1a2530', color: 'white' }
            }}
          >
            Verify Commuter Accounts
          </Button>
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Logout Button */}
        <Button
          startIcon={<Logout />}
          sx={{
            justifyContent: 'flex-start',
            bgcolor: 'transparent',
            color: 'white',
            '&:hover': { bgcolor: '#e74c3c' },
            textAlign: 'left',
            pl: 2,
            borderRadius: 0,
            py: 1.5,
            textTransform: 'none'
          }}
          onClick={handleAction.logout}
        >
          Log out
        </Button>
      </Box>
    </>
  );
return (
    <Box display="flex" minHeight="100vh" bgcolor="#f5f5f5">
      {/* Desktop Sidebar - hidden on mobile */}
      {!isMobile && (
        <Box
          width="240px"
          bgcolor="#2c3e50"
          color="#FFFFFF"
          display="flex"
          flexDirection="column"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 1000,
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            display: { xs: 'none', md: 'flex' }
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Mobile Drawer - shown only on mobile */}
      <Drawer
        anchor="left"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: '85%',
            maxWidth: '280px',
            boxSizing: 'border-box',
            bgcolor: '#2c3e50',
            color: 'white'
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>
        {sidebarContent}
      </Drawer>

      {/* Header */}
      <Box 
        sx={{ 
          position: 'fixed',
          left: isMobile ? 0 : '240px',
          right: 0,
          top: 0,
          height: '64px',
          bgcolor: '#3a86a8',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: isMobile ? 2 : 3,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu"
            onClick={handleAction.toggleDrawer}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Search Box - Responsive width */}
        <Box
  sx={{
    position: 'relative',
    borderRadius: '20px',
    bgcolor: 'white',
    width: isMobile ? '150px' : '300px',
    display: 'flex',
    alignItems: 'center',
    ml: isMobile ? 0 : 2
  }}
>
  <InputBase
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{ ml: 2, flex: 1, fontSize: isMobile ? '0.8rem' : '1rem' }}
  />
  <Box 
    sx={{ 
      bgcolor: '#2c3e50', 
      height: isMobile ? '32px' : '36px', 
      width: isMobile ? '32px' : '36px', 
      borderRadius: '50%',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      mr: 0.5
    }}
  >
    <Search sx={{ color: 'white', fontSize: isMobile ? '1rem' : '1.2rem' }} />
  </Box>
</Box>
        
        {/* City Logo - responsive size and hidden text on small mobile */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/images/cityseal1.png"
            alt="City of Sorsogon" 
            width={isMobile ? 32 : 40} 
            height={isMobile ? 32 : 40} 
            style={{ borderRadius: '50%' }}
          />
          {(!isSmallMobile) && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold', 
                ml: 1,
                fontSize: isMobile ? '0.8rem' : '1rem'
              }}
            >
              CITY OF SORSOGON
            </Typography>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ 
        flexGrow: 1, 
        p: isMobile ? 2 : 3, 
        ml: isMobile ? 0 : '240px',
        mt: '64px', 
        backgroundColor: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {/* Title based on current view */}
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          color="#3a86a8" 
          mb={isMobile ? 2 : 3}
        >
          {({
            'complaints': 'Active Complaints',
            'archived': 'Archived Complaints',
            'emergency': 'Emergency Complaints',
            'archivedEmergency': 'Archived Emergency Complaints',
            'createPersonnel': 'Create SK Personnel Account',
            'managePersonnel': 'Manage SK Personnel Accounts',
            'verifyCommuter': 'Verify Commuter Accounts',
            'resolved': 'Resolved Complaints',
            'dismissed': 'Dismissed Complaints',
            'tickets': 'Issued Tickets'
          })[activeView] || 'Dashboard'}
        </Typography>

        {/* Content based on active view */}
        <Box>
          {/* Complaints View */}
          {activeView === 'complaints' && (
  loadingReports ? (
    <Box display="flex" justifyContent="center" mt={4}>
      <CircularProgress sx={{ color: '#3a86a8' }} />
    </Box>
  ) : (
    <>
      {filteredComplaints.length === 0 ? (
        <Box textAlign="center" mt={4} p={3} bgcolor="white" borderRadius={2}>
          <Typography variant="body1" color="text.secondary">
            No complaints match your search criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredComplaints
            .filter(complaint => selectedCategory === '' || complaint.category === selectedCategory)
            .map(complaint => (
              <Grid item xs={12} sm={6} lg={4} key={complaint.id}>
                <ComplaintCard complaint={complaint} />
              </Grid>
            ))
          }
        </Grid>
      )}
    </>
  )
)}

          {/* Other views rendered using imported components */}
          {activeView === 'archived' && <ArchivedComplaints searchTerm={searchTerm} />}
          {activeView === 'emergency' && <EmergencyComplaints />}
          {activeView === 'archivedEmergency' && <ArchivedEmergencyComplaints />}
          {activeView === 'createPersonnel' && <SKPersonnelAccountForm />}
          {activeView === 'managePersonnel' && <SKPersonnelList />}
          {activeView === 'verifyCommuter' && <VerifyCommuterAccs />}
          {activeView === 'resolved' && <ResolvedComplaints resolvedComplaints={resolvedComplaints} />}
          {activeView === 'dismissed' && <DismissedComplaints dismissedComplaints={dismissedComplaints} />}
          {activeView === 'tickets' && <IssuedTickets issuedTickets={issuedTickets} />}
        </Box>
      </Box>

      {/* Dialogs - with responsive adjustments */}
      {/* Assign Dialog */}
      <Dialog 
        open={openAssignDialog} 
        onClose={() => setOpenAssignDialog(false)}
        fullScreen={isSmallMobile}
      >
        <DialogTitle>Assign Complaint</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedPersonnelId}
            onChange={(e) => setSelectedPersonnelId(e.target.value)}
            displayEmpty
            sx={{ mt: 1, mb: 2 }}
          >
            <MenuItem value="" disabled>Select Personnel</MenuItem>
            {personnelList.map((personnel) => (
              <MenuItem key={personnel.id} value={personnel.id}>
                {personnel.fullname}
              </MenuItem>
            ))}
          </Select>
          {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button onClick={assignComplaint} variant="contained" sx={{ bgcolor: '#3a86a8' }}>Assign</Button>
        </DialogActions>
      </Dialog>

      {/* Archive Dialog */}
      <Dialog 
        open={openArchiveDialog} 
        onClose={() => setOpenArchiveDialog(false)}
        fullScreen={isSmallMobile}
      >
        <DialogTitle>Confirm Archive</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to archive this complaint?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArchiveDialog(false)}>Cancel</Button>
          <Button onClick={confirmArchiveComplaint} variant="contained" sx={{ bgcolor: '#3a86a8' }}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Notify Dialog */}
      <Dialog 
  open={openNotifyDialog} 
  onClose={handleCloseNotifyDialog}
  fullWidth
  maxWidth="sm"
  aria-labelledby="notification-dialog-title"
>
  <DialogTitle id="notification-dialog-title">
    Send SMS Notification
  </DialogTitle>
  <DialogContent>
    {/* Error message display */}
    {errorMessage && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    )}
    
    {/* Success message display */}
    {successMessage && (
      <Alert severity="success" sx={{ mb: 2 }}>
        {successMessage}
      </Alert>
    )}
    
    <TextField
      autoFocus
      margin="dense"
      id="notification-message"
      label="SMS Message"
      type="text"
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Enter status update or information to share"
    />
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
      This message will be sent as an SMS to the recipient's contact number.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenNotifyDialog(false)} color="primary">
      Cancel
    </Button>
    <Button 
      onClick={sendSMSNotification} 
      color="primary" 
      variant="contained" 
      startIcon={<Send />}
      disabled={isProcessing || !message?.trim()}
      sx={{ bgcolor: '#3a86a8' }}
    >
      {isProcessing ? "Sending..." : "Send SMS"}
    </Button>
  </DialogActions>
</Dialog>

      {/* Notifications - positioned better for mobile */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={4000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={successMessage ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;