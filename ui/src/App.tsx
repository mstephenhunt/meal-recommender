import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuPage from './components/MainMenu/MainMenuPage';
import Login from './components/Login/Login';
import { AuthService } from './components/Login/auth.service';
import AppBase from './components/AppBase/AppBase';
import { AuthProvider } from './components/Login/auth.context';
import BuildRecipe from './components/BuildRecipe/BuildRecipe';
import FilteredRecipeNameSuggestor from './components/FilteredRecipeNameSuggestor/FilteredRecipeNameSuggestor';
import FilteredRecipe from './components/FilteredRecipe/FilteredRecipe';
import MyRecipes from './components/MyRecipes/MyRecipes';

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
        path="/recipe-name-suggestor"
        element={
          <AppBase
            children={
              <FilteredRecipeNameSuggestor />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/filtered-recipe"
        element={
          <AppBase
            children={
              <FilteredRecipe />
            }
            isLoggedIn={isLoggedIn}
          />
        }
      />
      <Route
        path="/my-recipes"
        element={
          <AppBase
            children={
              <MyRecipes />
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
