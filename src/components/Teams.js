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
  ToggleButtonGroup
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Teams
        </Typography>
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
            {team.name}
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
                    <GroupIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5" component="h2">
                      {team.name}
                    </Typography>
                  </Box>
                  
                  <Chip
                    icon={<AccountBalanceIcon />}
                    label={`Remaining Budget: ₹${team.budget} Crore`}
                    color={team.budget > 0 ? "success" : "error"}
                    sx={{ mb: 2 }}
                  />

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom>
                    Players
                  </Typography>
                  
                {team.players.length > 0 ? (
                    <List>
                    {team.players.map((player, index) => (
                        <React.Fragment key={index}>
                          <ListItem>
                            <ListItemText
                              primary={player.fullName}
                              secondary={`Set ${player.setNumber}`}
                            />
                            <ListItemSecondaryAction>
                              <Chip
                                icon={<PersonIcon />}
                                label={`₹${player.soldPrice} Cr`}
                                color="primary"
                                variant="outlined"
                              />
                            </ListItemSecondaryAction>
                          </ListItem>
                          {index < team.players.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                    </List>
                ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                      No players bought yet
                    </Typography>
                )}
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}

export default Teams; 