import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TeamsContext } from '../context/TeamsContext';
import './Teams.css';

function Teams() {
  const { isAuthenticated } = useContext(AuthContext);
  const { teams } = useContext(TeamsContext);
  const [selectedTeam, setSelectedTeam] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="auth-required">
        <h2>Please login to view teams</h2>
      </div>
    );
  }

  const handleTeamSelect = (teamId) => {
    setSelectedTeam(teamId === selectedTeam ? null : teamId);
  };

  return (
    <div className="teams-container">
      <h2>Teams</h2>
      <div className="team-filters">
        {teams.map(team => (
          <button
            key={team.id}
            className={`team-filter-button ${selectedTeam === team.id ? 'active' : ''}`}
            onClick={() => handleTeamSelect(team.id)}
          >
            {team.name}
          </button>
        ))}
      </div>
      <div className="teams-grid">
        {teams
          .filter(team => !selectedTeam || team.id === selectedTeam)
          .map(team => (
            <div key={team.id} className="team-card">
              <h3>{team.name}</h3>
              <p className="team-budget">Remaining Budget: ₹{team.budget} Crore</p>
              <div className="team-players">
                <h4>Players:</h4>
                {team.players.length > 0 ? (
                  <ul>
                    {team.players.map((player, index) => (
                      <li key={index} className="player-item">
                        <span className="player-name">{player.fullName}</span>
                        <span className="player-price">₹{player.soldPrice} Cr</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-players">No players bought yet</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Teams; 