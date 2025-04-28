import React, { useContext, useState, useEffect } from 'react';
import { TeamsContext } from '../context/TeamsContext';
import { PlayersContext } from '../context/PlayersContext';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box, Button, TextField, Paper } from '@mui/material';

const LiveAuction = () => {
  const { teams, updateTeamBudget } = useContext(TeamsContext);
  const { players, updatePlayerStatus } = useContext(PlayersContext);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBid, setCurrentBid] = useState('');
  const [auctionHistory, setAuctionHistory] = useState([]);

  useEffect(() => {
    // Find the first unsold player
    const unsoldPlayer = players.find(player => !player.sold);
    setCurrentPlayer(unsoldPlayer);
  }, [players]);

  const handleBid = (teamId) => {
    if (!currentPlayer || !currentBid) return;

    const bidAmount = parseFloat(currentBid);
    const team = teams.find(t => t.id === teamId);

    if (bidAmount <= team.budget) {
      // Update team budget
      updateTeamBudget(teamId, team.budget - bidAmount);
      
      // Update player status
      updatePlayerStatus(currentPlayer.id, {
        sold: true,
        teamId: teamId,
        price: bidAmount
      });

      // Add to auction history
      setAuctionHistory(prev => [...prev, {
        player: currentPlayer.name,
        team: team.name,
        amount: bidAmount,
        timestamp: new Date().toLocaleTimeString()
      }]);

      // Reset current bid
      setCurrentBid('');
      
      // Move to next unsold player
      const nextPlayer = players.find(player => !player.sold);
      setCurrentPlayer(nextPlayer);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Live Auction
      </Typography>

      <Grid container spacing={4}>
        {/* Current Player Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Current Player
              </Typography>
              {currentPlayer ? (
                <Box>
                  <Typography variant="h6">{currentPlayer.name}</Typography>
                  <Typography color="text.secondary">
                    Base Price: ₹{currentPlayer.basePrice} Cr
                  </Typography>
                  <TextField
                    fullWidth
                    label="Enter Bid Amount (in Cr)"
                    value={currentBid}
                    onChange={(e) => setCurrentBid(e.target.value)}
                    type="number"
                    sx={{ mt: 2 }}
                  />
                </Box>
              ) : (
                <Typography color="text.secondary">
                  All players have been sold!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Teams Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Teams
              </Typography>
              <Grid container spacing={2}>
                {teams.map((team) => (
                  <Grid item xs={12} key={team.id}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                      <CardMedia
                        component="img"
                        image={`/images/logo/${team.name.toLowerCase().replace(/\s+/g, '_')}.png`}
                        alt={team.name}
                        sx={{ width: 50, height: 50, objectFit: 'contain', mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{team.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Budget: ₹{team.budget} Cr
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleBid(team.id)}
                        disabled={!currentPlayer || !currentBid}
                      >
                        Bid
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Auction History Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Auction History
              </Typography>
              {auctionHistory.length > 0 ? (
                <Box>
                  {auctionHistory.map((item, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 1 }}>
                      <Typography>
                        {item.player} sold to {item.team} for ₹{item.amount} Cr at {item.timestamp}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  No bids yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LiveAuction; 