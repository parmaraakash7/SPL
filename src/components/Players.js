import React from 'react';
import playersData from '../data/players.json';

function Players() {
  return (
    <div className="players-container">
      <h2>All Players</h2>
      <div className="players-grid">
        {playersData.players.map(player => (
          <div key={player.id} className="player-card">
            <img src={player.imagePath} alt={player.name} />
            <div className="player-info">
              <h3>{player.fullName}</h3>
              <p>Set Number: {player.setNumber}</p>
              <p>Base Price: {player.basePrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Players; 