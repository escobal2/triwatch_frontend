import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider,
  Button,
  CircularProgress 
} from '@mui/material';
import { 
  AccountCircle, 
  ManageAccounts, 
  Archive as ArchiveIcon, 
  Notifications as NotificationsIcon 
} from '@mui/icons-material';
import API_BASE_URL from '@/config/apiConfig';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ArchivedEmergencyComplaints = () => {
    const [archivedComplaints, setArchivedComplaints] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchArchivedComplaints = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/archived-emergency-complaints`);
                if (response.data.archived_emergency_complaints) {
                    setArchivedComplaints(response.data.archived_emergency_complaints);
                } else {
                    setError('No data found. Please check the API response structure.');
                }
            } catch (error) {
                console.error("Error fetching archived complaints:", error);
                setError('Failed to fetch archived complaints. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedComplaints();
    }, []);

    // Helper function to format date time
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'Not provided';
        try {
            const date = new Date(dateTimeString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return dateTimeString;
        }
    };

    // Mock handler for demonstration purposes
    const handleAction = {
        restore: (id) => console.log('Restore complaint', id),
        delete: (id) => console.log('Delete complaint', id),
        view: (id) => console.log('View complaint details', id)
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, bgcolor: '#fee2e2', color: '#b91c1c', borderRadius: 1 }}>
                <Typography variant="body1">{error}</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {archivedComplaints.length === 0 ? (
                <Grid item xs={12}>
                    <Box sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: '#f9fafb', 
                        borderRadius: 1,
                        border: '1px dashed #d1d5db' 
                    }}>
                        <Typography variant="body1" color="text.secondary">
                            No archived Emergency Complaints found.
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                archivedComplaints.map((complaint) => (
                    <Grid item xs={12} sm={6} md={4} key={complaint.id}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            minWidth: 0
                        }}>
                            {/* Card Header - Matches the reference style */}
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
                                        bgcolor: '#81c784',
                                        color: '#2e7d32',
                                        px: 1,
                                        py: 0.25,
                                        ml: 0.5,
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Archived
                                </Typography>
                            </Box>
                            
                            <CardContent sx={{ 
                                flexGrow: 1, 
                                p: 0, 
                                "&:last-child": { pb: 0 }, 
                                overflowY: 'auto'
                            }}>
                                {/* Complainant Section */}
                                <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#f9f9f9' }}>
                                    <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                        mb: 0.5
                                    }}>
                                        Complainant
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
                                
                                {/* Incident Details Section */}
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
                                        
                                        {complaint.location && (
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
                                        )}
                                        
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
                                
                                {/* Vehicle Information Section - If Available */}
                                {complaint.franchise_plate_no && (
                                    <>
                                        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fff8e1' }}>
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
                                                            {complaint.franchise_plate_no}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                
                                                {/* Driver info if available */}
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
                                    </>
                                )}
                                
                                {/* Archive Status Information */}
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
                                            Archived By
                                        </Typography>
                                        
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center',
                                            bgcolor: '#e8f5e9',
                                            px: 0.5,
                                            py: 0.25,
                                            borderRadius: '4px',
                                            maxWidth: '60%',
                                            overflow: 'hidden'
                                        }}>
                                            <AccountCircle sx={{ 
                                                fontSize: { xs: 12, sm: 14 }, 
                                                mr: 0.5, 
                                                color: '#2e7d32' 
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
                                                {complaint.archived_by || 'System'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    {complaint.archived_date && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                display: 'block',
                                                mt: 0.5,
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                color: 'text.secondary'
                                            }}
                                        >
                                            Archived on: {formatDateTime(complaint.archived_date)}
                                        </Typography>
                                    )}
                                </Box>
                          
                                {/* Action buttons */}
                                <Box sx={{ 
                                    p: { xs: 0.5, sm: 1 },
                                    display: 'flex', 
                                    gap: 0.5,
                                    justifyContent: 'space-between',
                                    bgcolor: '#f5f5f5'
                                }}>
                                    {[
                                        { 
                                            label: 'Restore', 
                                            action: () => handleAction.restore(complaint.id), 
                                            color: '#0384fc', 
                                            hoverColor: '#0366d6',
                                            icon: <ArchiveIcon sx={{ fontSize: '0.9rem' }} />
                                        },
                                        { 
                                            label: 'Delete', 
                                            action: () => handleAction.delete(complaint.id), 
                                            color: '#f44336', 
                                            hoverColor: '#d32f2f',
                                            icon: <NotificationsIcon sx={{ fontSize: '0.9rem' }} />
                                        },
                                        { 
                                            label: 'View', 
                                            action: () => handleAction.view(complaint.id), 
                                            color: '#FF6A00', 
                                            hoverColor: '#FB8C00',
                                            icon: <ManageAccounts sx={{ fontSize: '0.9rem' }} />
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
                                
                                {/* File attachment if available */}
                                {complaint.file_url && (
                                    <Box sx={{ 
                                        p: { xs: 0.5, sm: 1 },
                                        textAlign: 'center',
                                        bgcolor: '#fafafa',
                                        borderTop: '1px solid #f0f0f0'
                                    }}>
                                        <Button
                                            href={complaint.file_url}
                                            target="_blank"
                                            variant="text"
                                            size="small"
                                            sx={{
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                color: '#0384fc',
                                                textDecoration: 'underline'
                                            }}
                                        >
                                            View Attachment
                                        </Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default ArchivedEmergencyComplaints;