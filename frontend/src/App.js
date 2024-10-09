import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Host from './components/Host';
import Player from './components/Player';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Host />} />
        <Route path="/player" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
