import React, { createContext, useState } from 'react';

export const TeamsContext = createContext();

export const TeamsProvider = ({ children }) => {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team 1', budget: 30, players: [] },
    { id: 2, name: 'Team 2', budget: 30, players: [] },
    { id: 3, name: 'Team 3', budget: 30, players: [] }
  ]);
  const [soldPlayers, setSoldPlayers] = useState([]);

  const updateTeams = (updatedTeams) => {
    setTeams(updatedTeams);
  };

  const addSoldPlayer = (playerId) => {
    setSoldPlayers([...soldPlayers, playerId]);
  };

  return (
    <TeamsContext.Provider value={{ teams, soldPlayers, updateTeams, addSoldPlayer }}>
      {children}
    </TeamsContext.Provider>
  );
}; 