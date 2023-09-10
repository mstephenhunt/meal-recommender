import React, { useEffect, useState } from 'react';
import { RecipeSuggestorService } from './recipe-suggestor.service';
import MenuBar from '../MenuBar/MenuBar';
import BotBase from '../BotBase/BotBase';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { useInternalRequest } from '../../services/internal-request';

export default function RecipeNameSuggestor() {
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
        const recipeNames = await RecipeSuggestorService.getFilteredRecipeNames(internalRequest);
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              minWidth: "120px",
            }}
          >
            Back
          </Button>
          <Button
          onClick={handleNewRecipesClick}
            variant="contained"
            sx={{
              minWidth: "120px",
            }}
          >
            Make New Recipes
          </Button>
        </div>
      </Container>
    </div>
  );
}
