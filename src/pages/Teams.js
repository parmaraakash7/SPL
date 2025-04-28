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
          bgColor: '#E8222E', // LSG Red
          textColor: '#FFFFFF',
          accentColor: '#000000' // LSG Black
        };
      default:
        return {
          bgColor: '#FFFFFF',
          textColor: '#000000',
          accentColor: '#1976D2'
        };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
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
                  '&:hover': {
                    boxShadow: `0 0 20px ${colors.accentColor}`
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
                  sx={{ objectFit: 'contain', p: 2 }}
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
                      pb: 1
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
                      borderRadius: 1
                    }}
                  >
                    Budget: ₹{team.budget} Cr
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{ color: colors.textColor }}
                    >
                      Players ({team.players.length}):
                    </Typography>
                    {team.players.length > 0 ? (
                      <ul style={{ color: colors.textColor }}>
                        {team.players.map((player) => (
                          <li key={player.id}>
                            {player.name} - ₹{player.price} Cr
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Typography variant="body2" sx={{ color: colors.textColor }}>
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