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
import Typography from '@mui/material/Typography';

export default function MyRecipes() {
  const internalRequest = useInternalRequest();
  const navigate = useNavigate();

  const [isLoadingRecipes, setIsLoadingRecipes] = useState<boolean>(true);
  const [recipes, setRecipes] = useState<{ [key: string]: Recipe[] } | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      const recipes = await MyRecipesService.getMyRecipes({ internalRequest });

      // Sort recipes by createdAt desc
      recipes.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Put recipes into buckets by date
      const buckets: { [key: string]: Recipe[] } = {};
      recipes.forEach((recipe) => {
        const date = new Date(recipe.createdAt).toLocaleDateString();
        if (!buckets[date]) {
          buckets[date] = [];
        }
        buckets[date].push(recipe);
      });

      setRecipes(buckets);
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
            {
              Object.keys(recipes!).map((date) => {
                return (
                  <div key={date}>
                    <Typography
                      variant="h5"
                      component="h1"
                      style={{ textAlign: 'center' }}
                      marginTop="20px"
                    >
                      {date}
                    </Typography>
                    {recipes![date].map((recipe) => {
                      return (
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
                      );
                    })}
                  </div>
                );
              })
            }
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