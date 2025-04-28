import React from 'react';
import playersData from '../data/players.json';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Paper,
  Chip,
  Stack
} from '@mui/material';

function Players() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          All Players
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center">
          Browse through the complete list of players available for auction
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {playersData.players.map(player => (
          <Grid item xs={12} sm={6} md={player.setNumber === 0 ? 6 : 4} key={player.id}>
            <Card 
              sx={{ 
                height: '100%',
                width: '100%',
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                }
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={player.imagePath}
                alt={player.name}
                sx={{ 
                  objectFit: 'cover',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="column" alignItems="center" spacing={1}>
                  <Typography variant="h5" component="h2" sx={{ color: 'text.primary', textAlign: 'center', fontWeight: 'bold' }}>
                    {player.fullName}
                  </Typography>
                  {player.setNumber === 0 ? (
                    <Chip
                      label="Icon Player"
                      sx={{
                        backgroundColor: '#FFD700',
                        color: 'black',
                        fontSize: '1.1rem',
                        padding: '8px 16px',
                      }}
                    />
                  ) : (
                    <Chip
                      label={`Base Price: ${player.basePrice}`}
                      sx={{
                        backgroundColor: '#FFD700',
                        color: 'black',
                        fontSize: '1.1rem',
                        padding: '8px 16px',
                      }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Players; 