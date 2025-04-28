import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TeamsProvider>
          <Router>
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    SNAP Premier League
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/live-auction"
                    >
                      Live Auction
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/players"
                    >
                      Players
                    </Button>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/teams"
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
          </Router>
        </TeamsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
