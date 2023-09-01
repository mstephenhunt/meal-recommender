import React, { useEffect, useState } from 'react';
import { RecipeSuggestorService } from './recipe-suggestor.service';
import MenuBar from '../MenuBar/MenuBar';
import BotBase from '../BotBase/BotBase';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { useInternalRequest } from '../../services/internal-request';

export default function RecipeSuggestor() {
  const navigate = useNavigate();
  const internalRequest = useInternalRequest();

  const [generateRecipeNames, setGenerateRecipeNames] = useState(true);
  const [recipeNames, setRecipeNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleBack = () => {
    navigate('/home');
  };

  const handleRecipeClick = (recipeName: string) => {
    navigate(`/recipe?recipeName=${encodeURIComponent(recipeName)}`);
  };

  const handleNewRecipesClick = () => {
    setGenerateRecipeNames(true);
    setIsLoading(true);
  };

  useEffect(() => {
    async function getRecipeNames() {
      try {
        const recipeNames = await RecipeSuggestorService.getRecipeNames(internalRequest);
        setRecipeNames(recipeNames);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    if (generateRecipeNames) {
      getRecipeNames();
      setGenerateRecipeNames(false);
    }
  }, [generateRecipeNames, internalRequest]);

  return (
    <div>
      <MenuBar />
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
          sx={{ 
            textTransform: "none",
            marginTop: '10px',  
            height: "70px",
            width: "100%",
            fontWeight: "bold",
          }}
          onClick={handleNewRecipesClick}
        >
          Make New Recipes
        </Button>
        <Button
          variant="contained"
          onClick={handleBack}
          sx={{
            textTransform: "none",
            marginTop: '10px',  
            height: "70px",
            width: "100%",
            fontWeight: "bold",
          }}
        >
          Back
        </Button>
      </Container>
    </div>
  );
}
