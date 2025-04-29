import React, { useState, useContext } from 'react';
import { TeamsContext } from '../context/TeamsContext';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  CardMedia,
  Button
} from '@mui/material';
import {
  Group as GroupIcon,
  AccountBalance as AccountBalanceIcon,
  Person as PersonIcon
} from '@mui/icons-material';

function Teams() {
  const { teams } = useContext(TeamsContext);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };

  const getTeamLogo = (teamName) => {
    switch (teamName) {
      case 'Vision Knight Riders':
        return '/images/logo/vkr.png';
      case 'Legacy Lions':
        return '/images/logo/lions.png';
      case 'Language Super Giants':
        return '/images/logo/lsg.png';
      default:
        return '/images/logo/spl.png';
    }
  };

  const formatPrice = (price) => {
    if (price >= 1) {
      return `₹${price} Cr`;
    } else {
      const lakhs = Math.round(price * 100);
      return `₹${lakhs} Lakhs`;
    }
  };

  const handleResetAuction = () => {
    if (window.confirm('Are you sure you want to reset the auction? This will clear all teams, players, and auction data.')) {
      // Clear all localStorage data
      localStorage.removeItem('teams');
      localStorage.removeItem('soldPlayers');
      localStorage.removeItem('unsoldPlayers');
      localStorage.removeItem('currentRound');
      
      // Reload the page to reset all state
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Teams
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          View team details and their purchased players
        </Typography>
      </Paper>

      <Box sx={{ mb: 4 }}>
        <ToggleButtonGroup
          value={selectedTeam}
          exclusive
          onChange={(e, newValue) => handleTeamSelect(newValue)}
          aria-label="team filter"
          sx={{ flexWrap: 'wrap', gap: 1 }}
        >
        {teams.map(team => (
            <ToggleButton
              key={team.id}
              value={team.id}
              sx={{ 
                minWidth: 120,
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  }
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src={getTeamLogo(team.name)}
                  alt={team.name}
                  sx={{
                    width: 24,
                    height: 24,
                    objectFit: 'contain'
                  }}
                />
                {team.name}
              </Box>
            </ToggleButton>
        ))}
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {teams
          .filter(team => !selectedTeam || team.id === selectedTeam)
          .map(team => (
            <Grid item xs={12} md={6} key={team.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  width: '100%',
                  minWidth: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      component="img"
                      src={getTeamLogo(team.name)}
                      alt={team.name}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        mr: 2
                      }}
                    />
                    <Typography variant="h5" component="h2">
                      {team.name}
                    </Typography>
                  </Box>

                  <Chip
                    icon={<AccountBalanceIcon />}
                    label={`Remaining Budget: ₹${Number(team.budget).toFixed(2)} Crore`}
                    color={team.budget > 0 ? "success" : "error"}
                    sx={{ mb: 2 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Players
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemText
                        primary={`${team.captain} (C)`}
                      />
                    </ListItem>
                    {team.players.length > 0 && <Divider />}
                    {team.players.length > 0 ? (
                      team.players.map((player, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={player.fullName}
                            />
                            <ListItemSecondaryAction>
                              {player.setNumber === 0 ? (
                                <Typography color="primary">
                                  Icon Player
                                </Typography>
                              ) : (
                                <Typography color="primary">
                                  {formatPrice(player.soldPrice)}
                                </Typography>
                              )}
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < team.players.length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText
                          primary="No players bought yet"
                          sx={{ color: 'text.secondary', textAlign: 'center' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default Teams; 