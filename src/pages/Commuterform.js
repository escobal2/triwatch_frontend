import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { styled } from '@mui/system';
import Image from 'next/image';
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

const RootContainer = styled('div')({
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',
});

const BackgroundImage = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'url("/images/citystreet.jpg")', // Add this background image to your public folder
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  zIndex: 0,
});

const BlueOverlay = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 72, 103, 0.8)', // Dark blue overlay with transparency
  zIndex: 1,
});

const ContentContainer = styled('div')({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '20px',
  boxSizing: 'border-box',
  textAlign: 'center',
  color: 'white',
});

const LogoContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '50px',
  marginBottom: '30px',
});

const StyledLogo = styled('div')({
  backgroundColor: 'white',
  borderRadius: '50%',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '150px',
  height: '150px',
});

const HeaderText = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '10px',
  color: 'white',
});

const SubHeaderText = styled(Typography)({
  fontSize: '36px',
  fontWeight: 'bold',
  marginBottom: '30px',
  color: 'white',
});

const WelcomeText = styled(Typography)({
  fontSize: '22px',
  marginBottom: '40px',
  color: 'white',
});

const ReportButton = styled(Button)({
  backgroundColor: '#D32F2F',
  color: 'white',
  padding: '10px 30px',
  fontSize: '18px',
  fontWeight: 'bold',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: '#B71C1C',
  },
});

const NavButton = styled(Button)({
  color: 'white',
  position: 'absolute',
  top: '20px',
  right: '20px',
});

const CommuterForm = () => {
  const [commuterName, setCommuterName] = useState('Loading...');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [commuterId, setCommuterId] = useState(null);
  const [commuter, setCommuter] = useState({ id: null, name: '' });
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const storedCommuter = sessionStorage.getItem('commuter');
    if (storedCommuter) {
      const parsedCommuter = JSON.parse(storedCommuter);
      setCommuter(parsedCommuter);
      setCommuterId(parsedCommuter.id);
    }
  }, []);

  useEffect(() => {
    if (!commuterId) {
      console.warn("No commuterId found!");
      return;
    }

    const fetchCommuterData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/commuter/${commuterId}`);
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
    <RootContainer>
      <BackgroundImage />
      <BlueOverlay />
      <ContentContainer>
        <NavButton onClick={handleDrawerOpen}>
          <MenuIcon />
        </NavButton>

        <HeaderText variant="h6">
          Seguridad Kaayusan Katranguilohan Kauswagan
        </HeaderText>

        <LogoContainer>
          <StyledLogo>
            <Image src="/images/sklogo3.png" alt="Transport Logo" width={150} height={150} />
          </StyledLogo>
          <StyledLogo>
            <Image src="/images/cityseal1.png" alt="City Seal" width={160} height={160} />
          </StyledLogo>
        </LogoContainer>

        <SubHeaderText variant="h3">
          COMMUTER PANEL
        </SubHeaderText>

        <WelcomeText variant="h5">
          Welcome, {commuterName || 'Guest'}
        </WelcomeText>

        <Link href="/commuter_report_form" passHref>
          <ReportButton variant="contained">
            Report an Incident
          </ReportButton>
        </Link>
      </ContentContainer>

      <Drawer anchor="right" open={openDrawer} onClose={handleDrawerClose}>
        <List sx={{ width: 250, padding: 2 }}>
          <ListItem button>
            <Link href="/edit-profile" passHref style={{ width: '100%' }}>
              <ListItemText primary="Edit Account" />
            </Link>
          </ListItem>
          <ListItem button>
            <Link href="/Commuter_login" passHref style={{ width: '100%' }}>
              <ListItemText primary="Logout" />
            </Link>
          </ListItem>
        </List>
      </Drawer>
    </RootContainer>
  );
};

export default CommuterForm;