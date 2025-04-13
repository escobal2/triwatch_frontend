import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router';

const WelcomePage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });
  
  // True if screen width is 600px or less
  const isMobile = useMediaQuery('(max-width:600px)');
  // True if screen width is between 601px and 960px
  const isTablet = useMediaQuery('(min-width:601px) and (max-width:960px)');
  const router = useRouter();

  // Check if user is already logged in, and redirect if they are
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedCommuter = sessionStorage.getItem('commuter');
      
      if (storedCommuter) {
        // User is already logged in, redirect to commuter panel
        router.replace('/index'); // Replace with your actual dashboard route
      }
    }
  }, [router]);

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  // Responsive styling
  const getFontSize = (baseSize) => {
    if (isMobile) return `${baseSize * 0.7}px`;
    if (isTablet) return `${baseSize * 0.85}px`;
    return `${baseSize}px`;
  };

  const getLogoSize = () => {
    if (isMobile) return 120;
    if (isTablet) return 160;
    return 200;
  };

  const getCityLogoSize = () => {
    if (isMobile) return 30;
    return 50;
  };

  const getButtonWidth = () => {
    if (isMobile) return '85%';
    if (isTablet) return '180px';
    return '200px';
  };

  const getContentMaxWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '90%';
    return '900px';
  };

  const rootContainerStyle = {
    width: '100%', // Changed from 100vw to 100% to prevent horizontal overflow
    height: '100vh',
    backgroundImage: 'url("/images/citystreet.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'auto', // Changed from 'hidden' to 'auto' to allow vertical scrolling only
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 78, 115, 0.8)', // Teal blue with 80% opacity
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? '10px' : '20px',
    boxSizing: 'border-box',
    overflowY: 'auto', // Allow vertical scrolling on small devices
    overflowX: 'hidden', // Prevent horizontal scrolling
  };

  const headerStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: isMobile ? '5px 10px' : '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Changed to flex-start to align city logo to the left
    zIndex: 10,
  };

  const contentContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    maxWidth: getContentMaxWidth(),
    margin: '0 auto',
    marginTop: isMobile ? '60px' : '0px', // Add top margin on mobile to account for header
    paddingBottom: isMobile ? '20px' : '0px', // Add bottom padding on mobile for scrolling
  };

  const logoContainerStyle = {
    marginBottom: isMobile ? '10px' : '20px',
  };
  
  // Update floating menu button style to be on the right side
  const floatingMenuButtonStyle = {
    position: 'fixed',
    top: isMobile ? '70px' : '90px',
    right: isMobile ? '10px' : '20px', // Changed to right instead of left
    zIndex: 1000,
    backgroundColor: 'rgba(0, 78, 115, 0.85)',
    borderRadius: '50%',
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 98, 145, 0.95)',
    }
  };

  return (
    <div style={rootContainerStyle}>
      <div style={overlayStyle}>
        <div style={headerStyle}>
          <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%">
            <Image 
              src="/images/cityseal1.png" 
              alt="City of Sorsogon" 
              width={getCityLogoSize()} 
              height={getCityLogoSize()} 
            />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              sx={{ 
                marginLeft: isMobile ? 1 : 2, 
                color: 'white', 
                fontWeight: 'bold',
                fontSize: getFontSize(isMobile ? 14 : 18)
              }}
            >
              CITY OF SORSOGON
            </Typography>
          </Box>
        </div>

        {/* Floating Menu Button on the right side */}
        <Box 
          onClick={handleDrawerOpen}
          sx={floatingMenuButtonStyle}
          role="button"
          aria-label="Open menu"
          tabIndex={0}
        >
          <MenuIcon sx={{ color: 'white' }} />
        </Box>

        <div style={contentContainerStyle}>
          <Typography 
            variant={isMobile ? "body1" : "h5"} 
            sx={{ 
              color: 'white', 
              mb: isMobile ? 1 : 2, 
              fontFamily: 'Arial, sans-serif',
              fontSize: getFontSize(isMobile ? 16 : 20), 
              px: isMobile ? 1 : 0
            }}
          >
            Seguridad Kaayusan Katranquilohan Kauswagan
          </Typography>
          
          <div style={logoContainerStyle}>
            <Image 
              src="/images/sklogo3.png" 
              alt="SK3 Logo" 
              width={getLogoSize()} 
              height={getLogoSize()} 
              style={{ borderRadius: '50%' }}
            />
          </div>
          
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            sx={{ 
              color: 'white', 
              fontWeight: 'bold', 
              mb: isMobile ? 1.5 : 3,
              fontSize: getFontSize(isMobile ? 24 : 32)
            }}
          >
            SK3 ONLINE REPORTING SYSTEM
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white', 
              mb: isMobile ? 2 : 4, 
              maxWidth: isMobile ? '95%' : '800px', // Reduced from 100% to prevent text overflow on mobile
              fontSize: getFontSize(isMobile ? 14 : 18),
              px: isMobile ? 2 : 0
            }}
          >
            A frontline government system ensuring swift and efficient complaint resolution for a 
            safer and more organized tricycle transport sector.
          </Typography>
          
          <Box 
            display="flex" 
            flexDirection={isMobile ? "column" : "row"} 
            justifyContent="center" 
            alignItems="center"
            width={isMobile ? "95%" : "auto"} // Reduced from 100% to prevent overflow on mobile
            mt={isMobile ? 1 : 2}
          >
            <Link href="/Emergency_report" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  fullWidth={isMobile}
                  sx={{ 
                    backgroundColor: '#d32f2f',
                    color: 'white',
                    width: getButtonWidth(),
                    height: isMobile ? '40px' : '50px',
                    margin: isMobile ? '5px 0' : '10px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontSize: getFontSize(16),
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#b71c1c',
                    },
                  }}
                >
                  Emergency Report
                </Button>
              </a>
            </Link>
            
            <Link href="/CreateCommuterAccount" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  fullWidth={isMobile}
                  sx={{ 
                    backgroundColor: '#42a5f5',
                    color: 'white',
                    width: getButtonWidth(),
                    height: isMobile ? '40px' : '50px',
                    margin: isMobile ? '5px 0' : '10px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontSize: getFontSize(16),
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                >
                  Create Account
                </Button>
              </a>
            </Link>
            
            <Link href="/Commuter_login" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  fullWidth={isMobile}
                  sx={{ 
                    backgroundColor: '#42a5f5',
                    color: 'white',
                    width: getButtonWidth(),
                    height: isMobile ? '40px' : '50px',
                    margin: isMobile ? '5px 0' : '10px',
                    borderRadius: '4px',
                    textTransform: 'none',
                    fontSize: getFontSize(16),
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#1976d2',
                    },
                  }}
                >
                  Log in as Commuter
                </Button>
              </a>
            </Link>
          </Box>
        </div>
      </div>

      {/* Drawer component (keeping the right anchor as in original) */}
      <Drawer 
        anchor="right" 
        open={openDrawer} 
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: isMobile ? '70vw' : '280px',
            backgroundColor: '#f5f5f5',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '16px',
            backgroundColor: '#004e73',
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: getFontSize(18) }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <List sx={{ padding: '16px' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: '#555', 
              marginBottom: '8px', 
              paddingLeft: '8px',
              fontSize: getFontSize(14)
            }}
          >
            Staff Access
          </Typography>
          
          <ListItem sx={{ padding: '8px 0' }}>
            <Link href="/Admin_Login" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    fontSize: getFontSize(14), 
                    padding: '10px 16px',
                    backgroundColor: '#1976D2',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1565C0'
                    }
                  }}
                >
                  Login as Admin
                </Button>
              </a>
            </Link>
          </ListItem>
          
          <ListItem sx={{ padding: '8px 0', marginTop: '8px' }}>
            <Link href="/sk_personel_login" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    fontSize: getFontSize(14), 
                    padding: '10px 16px',
                    backgroundColor: '#1976D2',
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#1565C0'
                    }
                  }}
                >
                  Login as Taskforce
                </Button>
              </a>
            </Link>
          </ListItem>
          
          <Divider sx={{ margin: '16px 0' }} />
          
          <ListItem sx={{ padding: '8px 0' }}>
            <Link href="/" passHref legacyBehavior>
              <a style={{ textDecoration: 'none', width: '100%' }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    fontSize: getFontSize(14), 
                    padding: '8px',
                    color: '#555',
                    borderColor: '#ccc',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#999',
                      backgroundColor: '#f9f9f9'
                    }
                  }}
                >
                  Home
                </Button>
              </a>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default WelcomePage;