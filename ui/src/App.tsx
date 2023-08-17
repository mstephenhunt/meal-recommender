import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainMenuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
