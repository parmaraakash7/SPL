import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TeamsContext } from '../context/TeamsContext';
import playersData from '../data/players.json';
import ReactConfetti from 'react-confetti';
import useSound from 'use-sound';
import soldSound from '../assets/sold.mp3';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Undo as UndoIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Celebration as CelebrationIcon,
  Lock as LockIcon
} from '@mui/icons-material';

function LiveAuction() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const { 
    teams, 
    soldPlayers, 
    unsoldPlayers, 
    updateTeams, 
    addSoldPlayer, 
    addUnsoldPlayer, 
    moveToNextRound,
    currentRound 
  } = useContext(TeamsContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPlayerList, setShowPlayerList] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [lastBiddingTeam, setLastBiddingTeam] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [showSoldDialog, setShowSoldDialog] = useState(false);
  const [soldInfo, setSoldInfo] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [playSoldSound] = useSound(soldSound);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(username, password)) {
      setUsername('');
      setPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handlePlayerSelect = (player) => {
    if (soldPlayers.includes(player.id)) {
      alert('This player has already been sold!');
      return;
    }
    setSelectedPlayer(player);
    if (player.setNumber === 0) {
      // Icon player - no base price or bidding
      setCurrentBid(0);
      setLastBiddingTeam(null);
    } else {
      const [amount, unit] = player.basePrice.split(' ');
      const basePrice = unit === 'Lakhs' ? parseFloat(amount) / 100 : parseFloat(amount);
      setCurrentBid(basePrice);
      setLastBiddingTeam(null);
    }
    setShowPlayerList(false);
    setBidHistory([]);
  };

  const calculateNextBid = (currentAmount) => {
    console.log('Current Amount:', currentAmount);
    let nextBid;
    if (currentAmount < 1) {
      nextBid = Number((currentAmount + 0.1).toFixed(2));
    } else if (currentAmount < 2) {
      nextBid = Number((currentAmount + 0.25).toFixed(2));
    } else {
      nextBid = Number((currentAmount + 0.5).toFixed(2));
    }
    console.log('Next Bid:', nextBid);
    return nextBid;
  };

  const handleTeamBid = (teamId) => {
    if (selectedPlayer.setNumber === 0) {
      // For icon players, directly assign to team
      const team = teams[teamId - 1];
      const updatedTeams = teams.map(team => {
        if (team.id === teamId) {
          return { 
            ...team, 
            players: [...team.players, { ...selectedPlayer, soldPrice: 0 }] 
          };
        }
        return team;
      });
      
      updateTeams(updatedTeams);
      addSoldPlayer(selectedPlayer.id);
      
      setSoldInfo({
        player: selectedPlayer,
        team: team.name,
        price: 0
      });
      setShowSoldDialog(true);
      setShowConfetti(true);
      playSoldSound();
      
      setSelectedPlayer(null);
      setCurrentBid(0);
      setLastBiddingTeam(null);
      setBidHistory([]);
      return;
    }

    if (lastBiddingTeam === teamId) {
      alert(`${teams[teamId - 1].name} cannot bid consecutively!`);
      return;
    }

    const nextBid = lastBiddingTeam ? calculateNextBid(currentBid) : currentBid;
    console.log('Final Next Bid:', nextBid);
    const team = teams[teamId - 1];
    
    if (team.budget - nextBid < 0) {
      alert(`${team.name} does not have enough budget! Cannot make this bid as it would result in negative purse.`);
      return;
    }

    setBidHistory([...bidHistory, { teams: [...teams], currentBid, lastBiddingTeam }]);
    setCurrentBid(nextBid);
    setLastBiddingTeam(teamId);
  };

  const handleUndo = () => {
    if (bidHistory.length > 0) {
      const lastState = bidHistory[bidHistory.length - 1];
      updateTeams(lastState.teams);
      setCurrentBid(lastState.currentBid);
      setLastBiddingTeam(lastState.lastBiddingTeam);
      setBidHistory(bidHistory.slice(0, -1));
    }
  };

  const handleSold = () => {
    if (selectedPlayer && lastBiddingTeam) {
      const team = teams[lastBiddingTeam - 1];
      
      if (team.budget - currentBid < 0) {
        alert(`${team.name} cannot afford the final bid!`);
        return;
      }

      const updatedTeams = teams.map(team => {
        if (team.id === lastBiddingTeam) {
          return { 
            ...team, 
            budget: team.budget - currentBid,
            players: [...team.players, { ...selectedPlayer, soldPrice: currentBid }] 
          };
        }
        return team;
      });
      
      updateTeams(updatedTeams);
      addSoldPlayer(selectedPlayer.id);
      
      setSoldInfo({
        player: selectedPlayer,
        team: team.name,
        price: currentBid
      });
      setShowSoldDialog(true);
      setShowConfetti(true);
      playSoldSound();
      
      setSelectedPlayer(null);
      setCurrentBid(0);
      setLastBiddingTeam(null);
      setBidHistory([]);
    }
  };

  const handleMoveToNextRound = () => {
    if (selectedPlayer) {
      addUnsoldPlayer(selectedPlayer);
      setSelectedPlayer(null);
      setCurrentBid(0);
      setLastBiddingTeam(null);
      setBidHistory([]);
    }
  };

  const handleRoundComplete = () => {
    if (currentRound === 1) {
      moveToNextRound();
    }
  };

  const formatBidAmount = (amount) => {
    if (amount >= 1) {
      return `₹${amount.toFixed(2)} Cr`;
    } else {
      const lakhs = Math.round(amount * 100);
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

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: 6, 
            maxWidth: 400, 
            width: '100%',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <img 
              src="/images/logo/spl_logo.png" 
              alt="SPL Logo" 
              style={{ 
                width: '120px', 
                height: '120px',
                marginBottom: '20px',
                filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))'
              }} 
            />
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Live Auction Login
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Enter your credentials to access the live auction
            </Typography>
          </Box>

          <Box 
            component="form" 
            onSubmit={handleLogin} 
            sx={{ 
              '& .MuiTextField-root': { 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'primary.main',
                  },
                },
              },
            }}
          >
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ 
                mt: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleResetAuction}
          startIcon={<WarningIcon />}
        >
          Reset Auction
        </Button>
      </Box>

      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <Box sx={{ mb: 4, position: 'relative', width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search player..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowPlayerList(true);
          }}
          onFocus={() => setShowPlayerList(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {showPlayerList && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              zIndex: 1,
              width: '100%',
              maxHeight: 300,
              overflow: 'auto',
              mt: 1,
              left: 0,
              right: 0
            }}
          >
            <List>
              {playersData.players
                .filter(player => {
                  // Skip if player is already sold
                  if (soldPlayers.includes(player.id)) return false;
                  
                  // Show all unsold players in both rounds
                  return true;
                })
                .filter(player => 
                  player.fullName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(player => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <ListItemText primary={player.fullName} />
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}
      </Box>

      {selectedPlayer && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={selectedPlayer.imagePath}
                alt={selectedPlayer.name}
                sx={{
                  objectFit: 'cover',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom sx={{ color: 'text.primary' }}>
                  {selectedPlayer.fullName}
                </Typography>
                {selectedPlayer.setNumber !== 0 && (
                  <Typography color="text.secondary" gutterBottom>
                    Base Price: {selectedPlayer.basePrice}
                  </Typography>
                )}
                {selectedPlayer.setNumber === 0 && (
                  <Typography color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Icon Player
                  </Typography>
                )}
                <Box sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  p: 2,
                  borderRadius: 1,
                  mt: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {selectedPlayer.setNumber === 0 ? (
                    <Typography variant="h6" sx={{ 
                      color: 'primary.main',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      mb: 1,
                      fontSize: '1.5rem'
                    }}>
                      Select a team to acquire this Icon Player
                    </Typography>
                  ) : (
                    <>
                      <Typography variant="h6" sx={{ 
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 1,
                        fontSize: '1.5rem'
                      }}>
                        Current Bid: {formatBidAmount(currentBid)}
                      </Typography>
                      {lastBiddingTeam && (
                        <Typography variant="h6" sx={{ 
                          color: 'success.main',
                          textAlign: 'center',
                          fontWeight: 'medium',
                          fontSize: '1.3rem'
                        }}>
                          Last Bid by: {teams[lastBiddingTeam - 1].name}
                        </Typography>
                      )}
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                },
              }}
            >
              <Grid container spacing={2}>
                {teams.map(team => (
                  <Grid item xs={12} sm={6} md={4} key={team.id}>
                    <Button
                      fullWidth
                      variant={lastBiddingTeam === team.id ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleTeamBid(team.id)}
                      disabled={team.budget < (lastBiddingTeam ? calculateNextBid(currentBid) : currentBid)}
                      sx={{ 
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                      }}
                    >
                      <Box
                        component="img"
                        src={`/images/logo/${team.name === 'Vision Knight Riders' ? 'vkr' : 
                              team.name === 'Legacy Lions' ? 'lions' : 
                              team.name === 'Language Super Giants' ? 'lsg' : 'spl'}.png`}
                        alt={team.name}
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))',
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">{team.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Budget: ₹{team.budget} Cr
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          Captain: {team.captain}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleTeamBid(team.id)}
                        disabled={!selectedPlayer || !currentBid}
                      >
                        Bid
                      </Button>
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<UndoIcon />}
                  onClick={handleUndo}
                  disabled={bidHistory.length === 0}
                >
                  Undo
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleSold}
                  disabled={!lastBiddingTeam}
                >
                  Sold
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<WarningIcon />}
                  onClick={handleMoveToNextRound}
                  disabled={bidHistory.length > 0}
                >
                  Move to Round {currentRound + 1}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Dialog
        open={showSoldDialog}
        onClose={() => setShowSoldDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: 'primary.main',
          pt: 3,
          '& .MuiTypography-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }
        }}>
          <CelebrationIcon sx={{ fontSize: '2rem', color: '#FFD700' }} />
          SOLD!
          <CelebrationIcon sx={{ fontSize: '2rem', color: '#FFD700' }} />
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            py: 3
          }}>
            <Box sx={{ 
              position: 'relative',
              width: '400px',
              height: '225px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '4px solid',
              borderColor: 'primary.main'
            }}>
              <CardMedia
                component="img"
                sx={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                image={soldInfo?.player.imagePath}
                alt={soldInfo?.player.name}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                mb: 1,
                color: 'text.primary'
              }}>
                {soldInfo?.player.fullName}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 2
              }}>
                <Box
                  component="img"
                  src={`/images/logo/${soldInfo?.team === 'Vision Knight Riders' ? 'vkr' : 
                        soldInfo?.team === 'Legacy Lions' ? 'lions' : 
                        soldInfo?.team === 'Language Super Giants' ? 'lsg' : 'spl'}.png`}
                  alt={soldInfo?.team}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: 'contain'
                  }}
                />
                <Typography variant="h5" color="text.secondary">
                  {soldInfo?.team}
                </Typography>
              </Box>
              {soldInfo?.player.setNumber !== 0 && (
                <Chip
                  label={`₹${soldInfo?.price} Crore`}
                  color="primary"
                  sx={{ 
                    fontSize: '1.5rem',
                    py: 3,
                    px: 3,
                    borderRadius: 3,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiChip-label': {
                      px: 2
                    }
                  }}
                />
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setShowSoldDialog(false)}
            variant="contained"
            sx={{ 
              px: 4,
              py: 1,
              borderRadius: 2,
              fontSize: '1.1rem'
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LiveAuction; 