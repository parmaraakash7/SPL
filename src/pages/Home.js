import React, { useContext } from 'react';
import { TeamsContext } from '../context/TeamsContext';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { teams } = useContext(TeamsContext);
  const navigate = useNavigate();

  const getTeamColors = (teamName) => {
    switch (teamName.toLowerCase()) {
      case 'tech titans':
        return {
          bgColor: '#2E0854',
          textColor: '#FFFFFF',
          accentColor: '#FDB913'
        };
      case 'code warriors':
        return {
          bgColor: '#FDB913',
          textColor: '#000000',
          accentColor: '#004BA0'
        };
      case 'binary blasters':
        return {
          bgColor: '#E8222E',
          textColor: '#FFFFFF',
          accentColor: '#000000'
        };
      default:
        return {
          bgColor: '#FFFFFF',
          textColor: '#000000',
          accentColor: '#1976D2'
        };
    }
  };

  const getTeamLogo = (teamName) => {
    switch (teamName.toLowerCase()) {
      case 'vision knight riders':
        return '/images/logo/vkr.png';
      case 'legacy lions':
        return '/images/logo/lions.png';
      case 'language super giants':
        return '/images/logo/lsg.png';
      default:
        return '/images/logo/default.png';
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome to SNAP Premier League
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                Where Programming Meets Sports
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/live-auction')}
                sx={{
                  bgcolor: '#FDB913',
                  color: '#000',
                  '&:hover': {
                    bgcolor: '#FFC107',
                  },
                }}
              >
                Join Live Auction
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/logo/spl_logo.png"
                alt="SPL Logo"
                sx={{
                  width: '100%',
                  maxWidth: 400,
                  filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Teams Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
          Featured Teams
        </Typography>
        <Grid container spacing={4}>
          {teams.map((team) => {
            const colors = getTeamColors(team.name);
            return (
              <Grid item xs={12} sm={6} md={4} key={team.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: colors.bgColor,
                    color: colors.textColor,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 0 20px ${colors.accentColor}`,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={getTeamLogo(team.name)}
                    alt={team.name}
                    sx={{ objectFit: 'contain', p: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      align="center"
                      sx={{
                        color: colors.textColor,
                        borderBottom: `2px solid ${colors.accentColor}`,
                        pb: 1,
                      }}
                    >
                      {team.name}
                    </Typography>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        backgroundColor: colors.accentColor,
                        color: colors.bgColor,
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      Budget: ₹{team.budget} Cr
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Statistics Section */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
            League Statistics
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: '#2E0854',
                  color: 'white',
                }}
              >
                <Typography variant="h3" gutterBottom>
                  {teams.length}
                </Typography>
                <Typography variant="h6">Teams</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: '#E8222E',
                  color: 'white',
                }}
              >
                <Typography variant="h3" gutterBottom>
                  35+
                </Typography>
                <Typography variant="h6">Total Players</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: '#FDB913',
                  color: 'black',
                }}
              >
                <Typography variant="h3" gutterBottom>
                  ₹{teams.reduce((acc, team) => acc + team.budget, 0)} Cr
                </Typography>
                <Typography variant="h6">Total Budget</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Explore Our Players
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mb: 4 }}>
            Discover talented programmers and build your winning team!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/players')}
            sx={{
              bgcolor: '#FDB913',
              color: '#000',
              '&:hover': {
                bgcolor: '#FFC107',
              },
            }}
          >
            View All Players
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 