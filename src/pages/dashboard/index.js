import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { styled } from '@mui/system';
import Image from 'next/image';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

const RootContainer = styled('div')(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden', // Prevents extra scroll
}));

const LeftPanel = styled('div')(({ isMobile }) => ({
  backgroundColor: '#FF7B00',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: isMobile ? '50vh' : '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  textAlign: 'center',
}));

const RightPanel = styled('div')(({ isMobile }) => ({
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Align buttons in the center
  justifyContent: 'center',
  width: '100%',
  height: isMobile ? '50vh' : '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  textAlign: 'center',
}));

// Styled Button for consistency
const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6A00',
  color: 'white',
  width: '100%', // Full-width on mobile and defined parent containers
  maxWidth: '130px', // Maximum width to control size on larger screens
  height: '50px', // Fixed height for consistent sizing
  margin: '10px 0',
  textTransform: 'none', // Prevent text from being uppercase
  [theme.breakpoints.down('sm')]: {
    maxWidth: '50%', // Full width on small screens
  },
}));

const CreateCommuterAccount = styled(StyledButton)({
  backgroundColor: '#1976D2', // Blue for commuter login
});
const EmergencyButton = styled(StyledButton)({
  backgroundColor: '#D32F2F', // Emergency color
  width: '100%',
});

const LoginButton = styled(StyledButton)({
  backgroundColor: '#449c46', // Blue for commuter login
});

const WelcomePage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <RootContainer isMobile={isMobile}>
      {/* Left Panel */}
      <LeftPanel isMobile={isMobile}>
        <Image src="/images/sklogo3.png" alt="Logo" width={150} height={150} />
        <Image src="/images/SK3.png" alt="Logo" width={150} height={120} />
        <Typography  variant="h5" sx={{ marginTop: 2, color: '#e6e9ea', fontWeight: 'bold', fontFamily: 'Times New Roman, Times, serif' }}>
        Online Reporting System
        </Typography>
        </LeftPanel>

      {/* Right Panel */}
      <RightPanel isMobile={isMobile}>
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ alignSelf: 'flex-end', top: 0 }}>
          <Toolbar>
            <Button onClick={handleDrawerOpen} sx={{ marginLeft: 'auto' }}>
              <MenuIcon sx={{ color: '#ff4500' }} />
            </Button>
          </Toolbar>
        </AppBar>
        
        {/* Align buttons in a row on large screens and stack on smaller ones */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', width: '100%', justifyContent: 'center' }}>

          
          <Link href="/Emergency_report" passHref>
            <EmergencyButton>Emergency Report</EmergencyButton>
          </Link>

          <Link href="/CreateCommuterAccount" passHref>
            <CreateCommuterAccount variant="contained">Create Account</CreateCommuterAccount>
          </Link>
          
          <Link href="/Commuter_login" passHref>
            <LoginButton variant="contained">Login as Commuter</LoginButton>
          </Link>
        </div>
      </RightPanel>

      {/* Drawer Menu */}
      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
        <List>
          <ListItem button>
            <Link href="/Admin_Login" passHref>
              <ListItemText>
                <StyledButton variant="contained" color="primary">
                  Login as Admin
                </StyledButton>
              </ListItemText>
            </Link>
          </ListItem>
          <ListItem button>
            <Link href="/sk_personel_login" passHref>
              <ListItemText>
                <StyledButton variant="contained" color="primary">
                  Login as SK Personnel
                </StyledButton>
              </ListItemText>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </RootContainer>
  );
};

export default WelcomePage;
