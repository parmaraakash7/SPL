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
  Chip
} from '@mui/material';
import { SportsCricket as CricketIcon } from '@mui/icons-material';

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
          <Grid item xs={12} sm={6} md={4} key={player.id}>
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
              <CardMedia
                component="img"
                height="300"
                image={player.imagePath}
                alt={player.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {player.fullName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<CricketIcon />}
                    label={`Set ${player.setNumber}`}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={player.basePrice}
                    color="secondary"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Players; 