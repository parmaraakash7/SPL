import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TeamsProvider } from './context/TeamsContext';
import LiveAuction from './components/LiveAuction';
import Players from './components/Players';
import Teams from './components/Teams';
import Home from './pages/Home';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import './App.css';

// Create a light theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  
  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.8
              }
            }}
            onClick={handleHomeClick}
          >
            <img 
              src="/images/logo/spl_logo.png" 
              alt="SPL Logo" 
              style={{ 
                height: '40px', 
                marginRight: '10px',
                filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'
              }} 
            />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                textShadow: '0 0 5px rgba(255,255,255,0.3)'
              }}
            >
              SNAP Premier League
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/live-auction"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Live Auction
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/players"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Players
            </Button>
            <Button 
              color="inherit" 
              component={Link} 
              to="/teams"
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Teams
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-auction" element={<LiveAuction />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TeamsProvider>
          <Router>
            <AppContent />
          </Router>
        </TeamsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
