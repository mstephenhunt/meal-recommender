import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { useLocation } from 'react-router-dom';
import { FilteredRecipeService, Recipe as APIRecipe } from "./filtered-recipe.service";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import RecipeTitle from "./RecipeTitle";
import RecipeIngredients  from "./RecipeIngredients";
import RecipeInstructions from "./RecipeInstructions";
import { useInternalRequest } from "../../services/internal-request";

export default function FilteredRecipe() {
  const location = useLocation();
  const navigate = useNavigate();
  const internalRequest = useInternalRequest();

  const queryParams = new URLSearchParams(location.search);
  const recipeName = queryParams.get('recipeName');
  const recipeId = queryParams.get('recipeId');

  const [recipe, setRecipe] = useState<APIRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRecipe() {
      try {
        if (recipeName) {
          const recipeData = await FilteredRecipeService.getRecipe({
            recipeName: recipeName!,
            internalRequest,
          });
          setRecipe(recipeData);
        }

        if (recipeId) {
          const recipeData = await FilteredRecipeService.getRecipeById({
            recipeId: parseInt(recipeId),
            internalRequest,
          });
          setRecipe(recipeData);
        }
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    if (!recipe) {
      getRecipe();
    }
  }, [recipeName, internalRequest, recipe, recipeId],);

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
          speechText={isLoading ? "🤔" : "Here's the recipe!"}
        />
        {isLoading ? (
          <CircularProgress style={{ margin: '20px auto' }} />
        ) : (
          recipe && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <RecipeTitle
                title={recipe.name}
                dietaryRestrictions={[]}
              />
              <RecipeIngredients
                ingredients={recipe.ingredients}
              />
              <RecipeInstructions
                instructions={recipe.instructions}
              />
            </Box>
          )
        )}
        <Button 
          variant="contained"
          sx={{ textTransform: "none", marginTop: '10px', marginBottom: '10px' }}
          onClick={() => navigate('/build-recipe')}
        >
          Back
        </Button>
      </Container>
    </div>
  );
}
