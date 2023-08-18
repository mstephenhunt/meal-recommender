import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';
import { AuthService } from './components/Login/auth.service';
import RecipeSuggestor from './components/RecipeSuggestor/RecipeSuggestor';

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

  const routes = (
    <Routes>
      <Route
        path="/"
        element={<Login authService={authService} setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/home"
        element={<MainMenuPage setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/dietary-restrictions"
        element={<DietaryRestrictionsPage setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="recipe-suggestor"
        element={<RecipeSuggestor setIsLoggedIn={setIsLoggedIn} />}
      />
    </Routes>
  );

  return (
    <Router>
      {isLoggedIn ? (
        // If logged in, show the routes
        routes
      ) : (
        // If not logged in, redirect to the login page
        <Login authService={authService} setIsLoggedIn={setIsLoggedIn} />
      )}
    </Router>
  );
}
