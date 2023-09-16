import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import DietaryRestrictionsPage from './components/DietaryRestrictions/DietaryRestrictionsPage';
import { AuthService } from './components/Login/auth.service';
import RecipeSuggestor from './components/RecipeSuggestor/RecipeSuggestor';
import Recipe from './components/Recipe/Recipe';
import AppBase from './components/AppBase/AppBase';
import { AuthProvider } from './components/Login/auth.context';
import BuildRecipe from './components/BuildRecipe/BuildRecipe';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkedJwt, setCheckedJwt] = useState(false);
  const authService = useMemo(() => new AuthService(setIsLoggedIn), []);

  useEffect(() => {
    // When the user refreshes the page, the isLoggedIn state is lost. To reset
    // this to the correct value, see if the user has a valid JWT.
    if (!isLoggedIn && authService.hasJwt()) {
      setIsLoggedIn(true);
    }

    setCheckedJwt(true);
  }, [isLoggedIn, setCheckedJwt, authService]);

  /**
   * If we haven't checked the JWT yet, return null. This is to prevent the
   * Login component from being rendered before we've had a chance to check
   * if the user is actually logged in or not. This occurs when the user
   * refreshes the page.
   */
  if (!checkedJwt) {
    return null;
  }

  const routes = (
    <Routes>
      <Route
        path="/"
        element={
          <AppBase
            children={
              <Login />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/home"
        element={
          <AppBase
            children={
              <MainMenuPage />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/dietary-restrictions"
        element={
          <AppBase
            children={
              <DietaryRestrictionsPage />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/recipe-suggestor"
        element={
          <AppBase
            children={
              <RecipeSuggestor />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/build-recipe"
        element={
          <AppBase
            children={
              <BuildRecipe />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/recipe"
        element={
          <AppBase
            children={
              <Recipe />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
    </Routes>
  );

  return (
    <Router>
      <AuthProvider authService={authService}>
        {routes}
      </AuthProvider>
    </Router>
  );
}
