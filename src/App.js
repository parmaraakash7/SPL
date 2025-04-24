import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TeamsProvider } from './context/TeamsContext';
import LiveAuction from './components/LiveAuction';
import Players from './components/Players';
import Teams from './components/Teams';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <TeamsProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <h1>SNAP Premier League</h1>
            </header>
            <nav className="navbar">
              <ul>
                <li>
                  <Link to="/live-auction">Live Auction</Link>
                </li>
                <li>
                  <Link to="/players">Players</Link>
                </li>
                <li>
                  <Link to="/teams">Teams</Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/live-auction" element={<LiveAuction />} />
              <Route path="/players" element={<Players />} />
              <Route path="/teams" element={<Teams />} />
            </Routes>
          </div>
        </Router>
      </TeamsProvider>
    </AuthProvider>
  );
}

export default App;
