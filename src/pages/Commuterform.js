import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { styled } from '@mui/system';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
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
  backgroundImage: 'url("/images/citystreet.jpg")',
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

const LogoutButton = styled(Button)({
  color: 'white',
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

const CommuterForm = () => {
  const [commuterName, setCommuterName] = useState('Loading...');
  const [commuterId, setCommuterId] = useState(null);
  const [commuter, setCommuter] = useState({ id: null, name: '' });
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const storedCommuter = sessionStorage.getItem('commuter');
      
      if (!storedCommuter) {
        // No session found, redirect to login
        router.replace('/Commuter_login');
        return;
      }
      
      try {
        const parsedCommuter = JSON.parse(storedCommuter);
        setCommuter(parsedCommuter);
        setCommuterId(parsedCommuter.id);
        setCommuterName(parsedCommuter.name); // Set name from session immediately
        setIsLoading(false);
      } catch (error) {
        console.error("Error parsing commuter data:", error);
        router.replace('/Commuter_login');
      }
    }
  }, [router]);

  // Prevent back button from going to login page
  useEffect(() => {
    const handlePopState = (event) => {
      // If the user is authenticated and tries to go back
      if (sessionStorage.getItem('commuter')) {
        // Push them forward to this page again
        router.replace('/Commuterform'); // Replace with your actual route
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  useEffect(() => {
    if (!commuterId) {
      return;
    }

    const fetchCommuterData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/commuter/${commuterId}`);
        setCommuterName(response.data.name);
      } catch (error) {
        console.error("API Error:", error);
        // Don't reset to "Unknown" - keep the name from session
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommuterData();
  }, [commuterId]);

  const handleLogout = () => {
    // Clear ALL session storage to ensure complete logout
    sessionStorage.clear();
    
    // Replace the current history entry with the login page
    router.replace('/Commuter_login');
  };

  // Return loading indicator while checking authentication
  if (isLoading) {
    return (
      <RootContainer>
        <BackgroundImage />
        <BlueOverlay />
        <ContentContainer>
          <Typography variant="h6" color="white">
            Loading...
          </Typography>
        </ContentContainer>
      </RootContainer>
    );
  }

  // If not authenticated and not loading, the first useEffect will handle redirection
  if (typeof window !== 'undefined' && !sessionStorage.getItem('commuter')) {
    return null;
  }

  return (
    <RootContainer>
      <BackgroundImage />
      <BlueOverlay />
      <ContentContainer>
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>

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
    </RootContainer>
  );
};

export default CommuterForm;