import React, { useEffect, useState } from 'react';
import { RecipeSuggestorService } from './recipe-suggestor.service';
import MenuBar from '../MenuBar/MenuBar';
import BotBase from '../BotBase/BotBase';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../Login/auth.service';

type RecipeSuggestorProps = {
  authService: AuthService;
};

export default function RecipeSuggestor(props: RecipeSuggestorProps) {
  const navigate = useNavigate();

  const [recipeNames, setRecipeNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleBack = () => {
    navigate('/home');
  };

  const handleRecipeClick = (recipeName: string) => {
    navigate(`/recipe?recipeName=${encodeURIComponent(recipeName)}`);
  };

  useEffect(() => {
    async function getRecipeNames() {
      try {
        const recipeNames = await RecipeSuggestorService.getRecipeNames();
        setRecipeNames(recipeNames);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    getRecipeNames();
  }, []);

  return (
    <div>
      <MenuBar 
        authService={props.authService}
      />
      <Container
        maxWidth="xs"
        style={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BotBase
          speechText={isLoading ? "🤔" : "Would you like to see any of these recipes?"}
        />
        {isLoading ? ( // Conditionally render CircularProgress
          <CircularProgress style={{ margin: '20px auto' }} />
        ) : (
          <div>
            {recipeNames.map((recipeName, index) => (
              <Button
                key={index}
                variant="outlined"
                color="primary"
                style={{ 
                  textTransform: 'none', 
                  width: '100%',
                  marginTop: '10px',
                }}
                onClick={() => handleRecipeClick(recipeName)}
              >
                {recipeName}
              </Button>
            ))}
          </div>
        )}
        <div
          style={{
            flexGrow: 1,
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "none", marginTop: '10px' }}
          disabled
        >
          Make New Recipes
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: "none", marginTop: '10px' }}
          onClick={handleBack}
        >
          Back
        </Button>
      </Container>
    </div>
  );
}
