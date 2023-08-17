import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<MainMenuPage />} />
        <Route path="/dietary-restrictions" element={<DietaryRestrictionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
