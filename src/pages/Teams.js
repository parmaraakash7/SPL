import React, { useContext } from 'react';
import { TeamsContext } from '../context/TeamsContext';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';

const Teams = () => {
  const { teams } = useContext(TeamsContext);

  const getTeamColors = (teamName) => {
    switch (teamName.toLowerCase()) {
      case 'vision knight riders':
        return {
          bgColor: '#2E0854', // KKR Purple
          textColor: '#FFFFFF',
          accentColor: '#FDB913' // KKR Gold
        };
      case 'legacy lions':
        return {
          bgColor: '#FDB913', // CSK Yellow
          textColor: '#000000',
          accentColor: '#004BA0' // CSK Blue
        };
      case 'language super giants':
        return {
          bgColor: '#0057E2', // LSG Blue
          textColor: '#FFFFFF',
          accentColor: '#000000' // LSG Black
        };
      default:
        return {
          bgColor: '#1A1A1A',
          textColor: '#FFFFFF',
          accentColor: '#1976D2'
        };
    }
  };

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        backgroundColor: '#121212',
        minHeight: '100vh',
        color: '#FFFFFF'
      }}
    >
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4,
          color: '#FFFFFF',
          textShadow: '0 0 10px rgba(255,255,255,0.3)'
        }}
      >
        Teams
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
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 0 20px ${colors.accentColor}`,
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={`/images/logo/${team.name === 'Vision Knight Riders' ? 'vkr' : 
                          team.name === 'Legacy Lions' ? 'lions' : 
                          team.name === 'Language Super Giants' ? 'lsg' : 'spl'}.png`}
                  alt={team.name}
                  sx={{ 
                    objectFit: 'contain', 
                    p: 2,
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(0,0,0,0.1)'
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom 
                    align="center"
                    sx={{ 
                      color: colors.textColor,
                      borderBottom: `2px solid ${colors.accentColor}`,
                      pb: 1,
                      textShadow: '0 0 5px rgba(0,0,0,0.3)'
                    }}
                  >
                    {team.name}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color="inherit" 
                    gutterBottom 
                    align="center"
                    sx={{ 
                      backgroundColor: colors.accentColor,
                      color: colors.bgColor,
                      p: 1,
                      borderRadius: 1,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    Budget: ₹{team.budget} Cr
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{ 
                        color: colors.textColor,
                        textShadow: '0 0 5px rgba(0,0,0,0.3)'
                      }}
                    >
                      Players ({team.players.length}):
                    </Typography>
                    {team.players.length > 0 ? (
                      <ul style={{ 
                        color: colors.textColor,
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {team.players.map((player) => (
                          <li 
                            key={player.id}
                            style={{
                              padding: '8px 0',
                              borderBottom: `1px solid ${colors.accentColor}33`,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <span>{player.name}</span>
                            <span style={{ 
                              backgroundColor: colors.accentColor,
                              color: colors.bgColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.9em'
                            }}>
                              ₹{player.price} Cr
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.textColor,
                          textAlign: 'center',
                          py: 2,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          borderRadius: 1
                        }}
                      >
                        No players yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default Teams; 