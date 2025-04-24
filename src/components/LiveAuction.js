import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TeamsContext } from '../context/TeamsContext';
import playersData from '../data/players.json';
import './LiveAuction.css';

function LiveAuction() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const { teams, soldPlayers, updateTeams, addSoldPlayer } = useContext(TeamsContext);
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
    // Prevent consecutive bids from same team
    if (lastBiddingTeam === teamId) {
      alert(`${teams[teamId - 1].name} cannot bid consecutively!`);
      return;
    }

    const nextBid = lastBiddingTeam ? calculateNextBid(currentBid) : currentBid;
    const team = teams[teamId - 1];
    
    // Check if purse would go negative after deduction
    if (team.budget - nextBid < 0) {
      alert(`${team.name} does not have enough budget! Cannot make this bid as it would result in negative purse.`);
      return;
    }

    // Save current state to history
    setBidHistory([...bidHistory, { teams: [...teams], currentBid, lastBiddingTeam }]);
    
    // Update current bid
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
      
      // Check if team can afford the final bid
      if (team.budget - currentBid < 0) {
        alert(`${team.name} cannot afford the final bid!`);
        return;
      }

      // Deduct money from winning team
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
      
      // Show sold dialog
      setSoldInfo({
        player: selectedPlayer,
        team: team.name,
        price: currentBid
      });
      setShowSoldDialog(true);
      
      // Reset auction state
      setSelectedPlayer(null);
      setCurrentBid(0);
      setLastBiddingTeam(null);
      setBidHistory([]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-dialog">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="live-auction">
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowPlayerList(true);
            }}
            onFocus={() => setShowPlayerList(true)}
          />
          {showPlayerList && (
            <div className="player-list">
              {playersData.players
                .filter(player => 
                  !soldPlayers.includes(player.id) &&
                  player.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(player => (
                  <div 
                    key={player.id} 
                    className="player-list-item"
                    onClick={() => handlePlayerSelect(player)}
                  >
                    {player.name}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {selectedPlayer && (
        <div className="auction-area">
          <div className="player-info">
            <img src={selectedPlayer.imagePath} alt={selectedPlayer.name} />
            <div className="player-details">
              <h3>{selectedPlayer.fullName}</h3>
              <p>Base Price: {selectedPlayer.basePrice}</p>
              <p className="current-bid">Current Bid: ₹{currentBid} Crore</p>
              {lastBiddingTeam && (
                <p className="last-bidder">Last Bid by: {teams[lastBiddingTeam - 1].name}</p>
              )}
            </div>
          </div>
          <div className="team-buttons">
            {teams.map(team => (
              <button
                key={team.id}
                className={`team-button ${lastBiddingTeam === team.id ? 'active' : ''}`}
                onClick={() => handleTeamBid(team.id)}
                disabled={team.budget < (lastBiddingTeam ? calculateNextBid(currentBid) : currentBid)}
              >
                <span className="team-name">{team.name}</span>
              </button>
            ))}
            <div className="action-buttons">
              <button 
                className="undo-button"
                onClick={handleUndo}
                disabled={bidHistory.length === 0}
              >
                Undo
              </button>
              <button 
                className="sold-button"
                onClick={handleSold}
                disabled={!lastBiddingTeam}
              >
                Sold
              </button>
              <button 
                className="unsold-button"
                onClick={() => {
                  setSelectedPlayer(null);
                  setCurrentBid(0);
                  setLastBiddingTeam(null);
                  setBidHistory([]);
                }}
              >
                Unsold for now
              </button>
            </div>
          </div>
        </div>
      )}

      {showSoldDialog && (
        <div className="sold-dialog-overlay">
          <div className="sold-dialog">
            <h2>Player Sold!</h2>
            <div className="sold-info">
              <img src={soldInfo.player.imagePath} alt={soldInfo.player.name} />
              <div className="sold-details">
                <h3>{soldInfo.player.fullName}</h3>
                <p>Sold to: {soldInfo.team}</p>
                <p className="sold-price">Price: ₹{soldInfo.price} Crore</p>
              </div>
            </div>
            <button 
              className="close-dialog"
              onClick={() => setShowSoldDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveAuction; 