import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';
import { AuthService } from './components/Login/auth.service';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authService = useMemo(() => new AuthService(setIsLoggedIn), []);

  useEffect(() => {
    if (isLoggedIn) {
      authService.scheduleTokenRefresh();
    } else {
      authService.cancelTokenRefresh();
    }
  }, [isLoggedIn, authService]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login  
          authService={authService}
          setIsLoggedIn={setIsLoggedIn}
        />} />
        <Route path="/home" element={<MainMenuPage />} />
        <Route path="/dietary-restrictions" element={<DietaryRestrictionsPage />} />
      </Routes>
    </Router>
  );
}