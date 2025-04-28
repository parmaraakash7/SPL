import React, { createContext, useState, useContext, useEffect } from 'react';

export const TeamsContext = createContext();

export function TeamsProvider({ children }) {
  // Load initial state from localStorage or use default values
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [
      { 
        id: 1, 
        name: 'Language Super Giants', 
        budget: 30, 
        players: [],
        captain: 'Hitesh Kumar'
      },
      { 
        id: 2, 
        name: 'Legacy Lions', 
        budget: 30, 
        players: [],
        captain: 'Raunak Das'
      },
      { 
        id: 3, 
        name: 'Vision Knight Riders', 
        budget: 30, 
        players: [],
        captain: 'Siva Kailash Sachithanandam'
      }
    ];
  });

  const [soldPlayers, setSoldPlayers] = useState(() => {
    const savedSoldPlayers = localStorage.getItem('soldPlayers');
    return savedSoldPlayers ? JSON.parse(savedSoldPlayers) : [];
  });

  const [unsoldPlayers, setUnsoldPlayers] = useState(() => {
    const savedUnsoldPlayers = localStorage.getItem('unsoldPlayers');
    return savedUnsoldPlayers ? JSON.parse(savedUnsoldPlayers) : [];
  });

  const [currentRound, setCurrentRound] = useState(() => {
    const savedRound = localStorage.getItem('currentRound');
    return savedRound ? parseInt(savedRound) : 1;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('soldPlayers', JSON.stringify(soldPlayers));
  }, [soldPlayers]);

  useEffect(() => {
    localStorage.setItem('unsoldPlayers', JSON.stringify(unsoldPlayers));
  }, [unsoldPlayers]);

  useEffect(() => {
    localStorage.setItem('currentRound', currentRound.toString());
  }, [currentRound]);

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
    setUnsoldPlayers([]);
    setCurrentRound(prev => prev + 1);
  };

  return (
    <TeamsContext.Provider
      value={{
        teams,
        soldPlayers,
        unsoldPlayers,
        currentRound,
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