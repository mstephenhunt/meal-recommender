import React, { useState, useEffect } from 'react';
import MenuBar from '../MenuBar/MenuBar';
import BotBase from '../BotBase/BotBase';
import { MyRecipesService } from './my-recipes.service';
import { useInternalRequest } from '../../services/internal-request';
import { Recipe } from '../FilteredRecipe/filtered-recipe.service';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function MyRecipes() {
  const internalRequest = useInternalRequest();
  const navigate = useNavigate();

  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const recipes = await MyRecipesService.getMyRecipes({ internalRequest });

      setRecipes(recipes);
      setIsLoadingRecipes(false);
    }

    if (isLoadingRecipes) {
      fetchRecipes();
    }
  }, [internalRequest, isLoadingRecipes]);

  return (
    <div>
      <MenuBar />
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BotBase
          speechText={isLoadingRecipes ? "🤔" : "Here are your previous recipes"}
        />
        {isLoadingRecipes ? (
         <CircularProgress style={{ margin: '20px auto' }} />
        ) : (
          <div>
            {recipes.map((recipe) => (
              <Button
                fullWidth
                variant='contained'
                key={recipe.id}
                onClick={() => {
                  navigate(`/filtered-recipe?recipeId=${recipe.id}`);
                }}
                style={{ margin: '10px 0' }}
              >
                {recipe.name}
              </Button>
            ))}
          </div>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate('/home')}
          sx={{
            marginTop: "20px",
          }}
        >
          Back to Main Menu
        </Button>
        </Container>
    </div>
  );
}