import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Divider,
  useMediaQuery
} from '@mui/material';
import { AccountCircle, Archive as ArchiveIcon } from '@mui/icons-material';
import API_BASE_URL from '@/config/apiConfig';

const ArchivedComplaints = ({ searchTerm = '' }) => {
    const [archivedComplaints, setArchivedComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const isSmallMobile = useMediaQuery('(max-width:400px)');

    // Format datetime similar to the original component
    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return 'N/A';
        
        try {
            const date = new Date(dateTimeStr);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            return dateTimeStr; // Return original if parsing fails
        }
    };

    // Fetch archived complaints
    useEffect(() => {
        const fetchArchivedComplaints = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/archived-complaints`);
                setArchivedComplaints(response.data.archived_complaints || []);
            } catch (error) {
                console.error("Error fetching archived complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArchivedComplaints();
    }, []);

    // Filter complaints based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredComplaints(archivedComplaints);
            return;
        }
        
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = archivedComplaints.filter(complaint => 
            complaint.fullName?.toLowerCase().includes(searchTermLower) ||
            complaint.contactNumber?.toLowerCase().includes(searchTermLower) ||
            complaint.category?.toLowerCase().includes(searchTermLower) ||
            complaint.complaintDetails?.toLowerCase().includes(searchTermLower) ||
            complaint.id?.toString().includes(searchTermLower)
        );
        
        setFilteredComplaints(filtered);
    }, [searchTerm, archivedComplaints]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress sx={{ color: '#FF6A00' }} />
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            {filteredComplaints.length === 0 ? (
                <Grid item xs={12}>
                    <Box 
                        textAlign="center" 
                        mt={2} 
                        p={3} 
                        bgcolor="white" 
                        borderRadius={2}
                        boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
                    >
                        <ArchiveIcon sx={{ fontSize: 40, color: '#9e9e9e', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary">
                            {searchTerm ? "No archived complaints match your search criteria" : "No archived complaints found"}
                        </Typography>
                    </Box>
                </Grid>
            ) : (
                filteredComplaints.map((complaint) => (
                    <Grid item xs={12} sm={6} lg={4} key={complaint.id}>
                        <Card sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                            borderRadius: '12px',
                            overflow: 'hidden',
                            minWidth: 0
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
                                                    {complaint.fullName || 'Not provided'}
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
                                                    {complaint.category || 'Unknown'}
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
                                                    {complaint.location || 'Not specified'}
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
                                                    {complaint.complaintDetails || 'No details provided'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                                
                                <Divider />
                                
                                {/* Vehicle Information */}
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
                                        
                                        {/* Driver details if available */}
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
                                
                                {/* Archive Information Section */}
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
                                            Archived Info
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
                                                color: 'text.secondary',
                                                fontSize: { xs: '0.65rem', sm: '0.7rem' }
                                            }}
                                        >
                                            Archived on: {formatDateTime(complaint.archived_date)}
                                        </Typography>
                                    )}
                                </Box>
        
                                {/* Additional Info Section - Supporting Files */}
                                {complaint.file_url && (
                                    <>
                                        <Divider />
                                        <Box sx={{ p: { xs: 1, sm: 1.5 }, bgcolor: '#fafafa' }}>
                                            <Typography variant="subtitle2" color="#0384fc" fontWeight="bold" sx={{ 
                                                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                mb: 0.5
                                            }}>
                                                Supporting Files
                                            </Typography>
                                            
                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                bgcolor: '#f0f4f8',
                                                p: 0.75,
                                                borderRadius: '4px',
                                                border: '1px dashed #b0bec5'
                                            }}>
                                                <Typography
                                                    component="a"
                                                    href={complaint.file_url}
                                                    target="_blank"
                                                    variant="caption"
                                                    sx={{
                                                        color: '#0366d6',
                                                        textDecoration: 'none',
                                                        '&:hover': {
                                                            textDecoration: 'underline'
                                                        },
                                                        display: 'block',
                                                        width: '100%',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    View Attached File
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            )}
        </Grid>
    );
};

export default ArchivedComplaints;