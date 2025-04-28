import React, { createContext, useState, useContext } from 'react';

export const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Language Super Giants', budget: 30, players: [] },
    { id: 2, name: 'Legacy Lions', budget: 30, players: [] },
    { id: 3, name: 'Vision Knight Riders', budget: 30, players: [] }
  ]);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);

  const updateTeams = (newTeams) => {
    setTeams(newTeams);
  };

  const addSoldPlayer = (playerId) => {
    setSoldPlayers([...soldPlayers, playerId]);
  };

  const addUnsoldPlayer = (player) => {
    setUnsoldPlayers([...unsoldPlayers, player]);
  };

  const moveToNextRound = () => {
    // Reset unsold players list for the next round
    setUnsoldPlayers([]);
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        soldPlayers,
        unsoldPlayers,
        updateTeams,
        addSoldPlayer,
        addUnsoldPlayer,
        moveToNextRound
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (!context) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
} 