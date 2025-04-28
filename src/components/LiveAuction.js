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
  Person as PersonIcon
} from '@mui/icons-material';

function LiveAuction() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const { teams, soldPlayers, unsoldPlayers, updateTeams, addSoldPlayer, addUnsoldPlayer, moveToNextRound } = useContext(TeamsContext);
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
  const [currentRound, setCurrentRound] = useState(1);
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
    setCurrentBid(parseFloat(player.basePrice.split(' ')[0]));
    setLastBiddingTeam(null);
    setShowPlayerList(false);
    setBidHistory([]);
  };

  const calculateNextBid = (currentAmount) => {
    if (currentAmount < 1) return currentAmount + 0.1;
    if (currentAmount < 2) return currentAmount + 0.25;
    return currentAmount + 0.5;
  };

  const handleTeamBid = (teamId) => {
    if (lastBiddingTeam === teamId) {
      alert(`${teams[teamId - 1].name} cannot bid consecutively!`);
      return;
    }

    const nextBid = lastBiddingTeam ? calculateNextBid(currentBid) : currentBid;
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
      setCurrentRound(2);
      moveToNextRound();
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom align="center">
            Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
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
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" align="center">
          Current Round: {currentRound}
        </Typography>
        {currentRound === 2 && (
          <Alert severity="info" sx={{ mt: 1 }}>
            This is Round 2 - featuring previously unsold players
          </Alert>
        )}
      </Paper>

      <Box sx={{ mb: 4 }}>
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
              mt: 1
            }}
          >
            <List>
              {playersData.players
                .filter(player => 
                  !soldPlayers.includes(player.id) &&
                  (currentRound === 1 || unsoldPlayers.some(p => p.id === player.id)) &&
                  player.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(player => (
                  <ListItem
                    key={player.id}
                    button
                    onClick={() => handlePlayerSelect(player)}
                  >
                    <ListItemText primary={player.name} />
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}
      </Box>

      {selectedPlayer && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={selectedPlayer.imagePath}
                alt={selectedPlayer.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {selectedPlayer.fullName}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  Base Price: {selectedPlayer.basePrice}
                </Typography>
                <Chip
                  icon={<PersonIcon />}
                  label={`Current Bid: ₹${currentBid} Crore`}
                  color="primary"
                  sx={{ mt: 1 }}
                />
                {lastBiddingTeam && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Last Bid by: {teams[lastBiddingTeam - 1].name}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {teams.map(team => (
                  <Grid item xs={12} sm={6} md={4} key={team.id}>
                    <Button
                      fullWidth
                      variant={lastBiddingTeam === team.id ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleTeamBid(team.id)}
                      disabled={team.budget < (lastBiddingTeam ? calculateNextBid(currentBid) : currentBid)}
                      sx={{ height: '100%' }}
                    >
                      <Box>
                        <Typography variant="subtitle1">{team.name}</Typography>
                        <Typography variant="caption" display="block">
                          Budget: ₹{team.budget} Crore
                        </Typography>
                      </Box>
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
      >
        <DialogTitle>Player Sold!</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <CardMedia
              component="img"
              sx={{ width: 100, height: 100, borderRadius: 1 }}
              image={soldInfo?.player.imagePath}
              alt={soldInfo?.player.name}
            />
            <Box>
              <Typography variant="h6">{soldInfo?.player.fullName}</Typography>
              <Typography color="text.secondary">
                Sold to: {soldInfo?.team}
              </Typography>
              <Chip
                label={`Price: ₹${soldInfo?.price} Crore`}
                color="primary"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSoldDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LiveAuction; 