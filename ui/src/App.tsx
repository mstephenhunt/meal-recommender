import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';
import { AuthService } from './components/Login/auth.service';
import RecipeSuggestor from './components/RecipeSuggestor/RecipeSuggestor';
import Recipe from './components/Recipe/Recipe';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authService = useMemo(() => new AuthService(setIsLoggedIn), []);

  useEffect(() => {
    if (authService.isLoggedIn()) {
      authService.scheduleTokenRefresh();
    } else {
      authService.cancelTokenRefresh();
    }
  }, [isLoggedIn, authService]);

  const routes = (
    <Routes>
      <Route
        path="/"
        element={<Login authService={authService} />}
      />
      <Route
        path="/home"
        element={<MainMenuPage authService={authService} />}
      />
      <Route
        path="/dietary-restrictions"
        element={<DietaryRestrictionsPage authService={authService} />}
      />
      <Route
        path="/recipe-suggestor"
        element={<RecipeSuggestor authService={authService} />}
      />
      <Route
        path="/recipe"
        element={<Recipe authService={authService} />}
      />
    </Routes>
  );

  return (
    <Router>
      {authService.isLoggedIn() ? (
        // If logged in, show the routes
        routes
      ) : (
        // If not logged in, redirect to the login page
        <Login authService={authService} />
      )}
    </Router>
  );
}
