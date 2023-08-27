import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';
import { AuthService } from './components/Login/auth.service';
import RecipeSuggestor from './components/RecipeSuggestor/RecipeSuggestor';
import Recipe from './components/Recipe/Recipe';
import AppBase from './components/AppBase/AppBase';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const authService = useMemo(() => new AuthService(setIsLoggedIn), []);

  useEffect(() => {
    if (!authService.isLoggedIn()) {
      authService.logOut();
    }
  }, [isLoggedIn, authService]);

  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          <AppBase
            children={
              <Login authService={authService} />
            }
          />
        }
      />
      <Route
        path="/home"
        element={
          <AppBase
            children={
              <MainMenuPage authService={authService} />
            }
          />
        }
      />
      <Route
        path="/dietary-restrictions"
        element={
          <AppBase
            children={
              <DietaryRestrictionsPage authService={authService} />
            }
          />
        }
      />
      <Route
        path="/recipe-suggestor"
        element={
          <AppBase
            children={
              <RecipeSuggestor authService={authService} />
            }
          />
        }
      />
      <Route
        path="/recipe"
        element={
          <AppBase
            children={
              <Recipe authService={authService} />
            }
          />
        }
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
