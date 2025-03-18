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
  width: '100%',
  maxWidth: '130px',
  height: '50px',
  margin: '10px 0',
  textTransform: 'none',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#E65C00', // Darker orange on hover
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '50%',
  },
}));

const CreateCommuterAccount = styled(StyledButton)({
  backgroundColor: '#1976D2', // Blue for commuter login
  '&:hover': {
    backgroundColor: '#1565C0', // Darker blue on hover
  },
});

const EmergencyButton = styled(StyledButton)({
  backgroundColor: '#D32F2F', // Red for emergency
  '&:hover': {
    backgroundColor: '#B71C1C', // Darker red on hover
  },
});

const LoginButton = styled(StyledButton)({
  backgroundColor: '#449c46', // Green for commuter login
  '&:hover': {
    backgroundColor: '#357a38', // Darker green on hover
  },
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
        <Image src="/images/triwatch1.png" alt="Logo" width={250} height={90} />
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
  <List sx={{ width: isMobile ? '70vw' : '250px', padding: '10px' }}>
    <ListItem sx={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
      <Link href="/Admin_Login" passHref>
        <StyledButton sx={{ width: '180px', fontSize: '14px', padding: '10px' }}>
          Login as Admin
        </StyledButton>
      </Link>
    </ListItem>
    <ListItem sx={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
      <Link href="/sk_personel_login" passHref>
        <StyledButton sx={{ width: '180px', fontSize: '14px', padding: '10px' }}>
          Login as Taskforce
        </StyledButton>
      </Link>
    </ListItem>
  </List>
</Drawer>

    </RootContainer>
  );
};

export default WelcomePage;
