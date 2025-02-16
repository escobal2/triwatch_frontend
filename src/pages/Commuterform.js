import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import { useRouter } from 'next/router';
import API_BASE_URL from '@/config/apiConfig';

const RootContainer = styled('div')(({ isMobile }) => ({
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
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
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: isMobile ? '50vh' : '100vh',
  padding: '20px',
  boxSizing: 'border-box',
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6A00',
  color: 'white',
  maxWidth: '130px',
  height: '50px',
  margin: '10px 0',
  textTransform: 'none',
}));

const EmergencyButton = styled(StyledButton)({
  backgroundColor: '#D32F2F',
});

const CommuterForm = () => {
  const [commuterName, setCommuterName] = useState('Loading...');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [commuterId, setCommuterId] = useState(null);
  const [commuter, setCommuter] = useState({ id: null, name: '' });
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();
  const { id } = router.query; // Get commuter ID from URL

  useEffect(() => {
    // Retrieve commuter data from sessionStorage
    const storedCommuter = sessionStorage.getItem('commuter');
    if (storedCommuter) {
      const parsedCommuter = JSON.parse(storedCommuter);
      console.log("Retrieved from sessionStorage:", parsedCommuter);
      setCommuter(parsedCommuter);
      setCommuterId(parsedCommuter.id); // Assuming commuter object has an `id`
    }
  }, []);

  useEffect(() => {
    if (!commuterId) {
      console.warn("No commuterId found!");
      return;
    }

    const fetchCommuterData = async () => {
      try {
        console.log(`Fetching data for ID: ${commuterId}`);
        const response = await axios.get(`${API_BASE_URL}/commuter/${commuterId}`);
        console.log("API Response:", response.data);
        setCommuterName(response.data.name);
      } catch (error) {
        console.error("API Error:", error);
        setCommuterName("Unknown");
      }
    };

    fetchCommuterData();
  }, [commuterId]);

  
  
  

  const handleDrawerOpen = () => setOpenDrawer(true);
  const handleDrawerClose = () => setOpenDrawer(false);

  return (
    <RootContainer isMobile={isMobile}>
      <LeftPanel isMobile={isMobile}>
        <Image src="/images/sklogo3.png" alt="Logo" width={150} height={150} />
        <Image src="/images/SK3.png" alt="Logo" width={150} height={120} />
        <Typography
          variant="h5"
          sx={{ marginTop: 2, color: '#e6e9ea', fontWeight: 'bold', fontFamily: 'Times New Roman, Times, serif' }}
        >
          Commuter Panel
        </Typography>
      </LeftPanel>

      <RightPanel isMobile={isMobile}>
        <AppBar position="fixed" color="transparent" elevation={0} sx={{ alignSelf: 'flex-end', top: 0 }}>
          <Toolbar>
            <Button onClick={handleDrawerOpen} sx={{ marginLeft: 'auto' }}>
              <MenuIcon sx={{ color: '#ff4500' }} />
            </Button>
          </Toolbar>
        </AppBar>

        <Typography
          variant="h6"
          sx={{ marginBottom: 2, color: '#000', fontWeight: 'bold', fontFamily: 'Times New Roman, Times, serif' }}
        >
        Welcome, {commuterName || 'Guest'}
        </Typography>

        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          <Link href="/commuter_report_form" passHref>
            <EmergencyButton variant="contained">Report an Incident</EmergencyButton>
          </Link>
        </div>
      </RightPanel>

      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
        <List>
          <ListItem button>
            <Link href="/edit-profile" passHref>
              <ListItemText>
                <StyledButton variant="contained">Edit Account</StyledButton>
              </ListItemText>
            </Link>
          </ListItem>
          <ListItem button>
            <Link href="/Commuter_login" passHref>
              <ListItemText>
                <StyledButton variant="contained">Logout</StyledButton>
              </ListItemText>
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </RootContainer>
  );
};

export default CommuterForm;