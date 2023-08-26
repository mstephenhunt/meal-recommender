import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { AuthService } from "../Login/auth.service";
import { useLocation } from 'react-router-dom';
import { RecipeService, Recipe as APIRecipe } from "./recipe.service";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import RecipeTitle from "./RecipeTitle";
import RecipeIngredients  from "./RecipeIngredients";

type RecipeProps = {
  authService: AuthService;
}

export default function Recipe(props: RecipeProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const recipeName = queryParams.get('recipeName');

  const [recipe, setRecipe] = useState<APIRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getRecipe() {
      try {
        const recipeData = await RecipeService.getRecipe(recipeName!);
        setRecipe(recipeData);
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    }

    getRecipe();
  }, [recipeName]);

  return (
    <div>
      <MenuBar
        authService={props.authService}
      />
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
                dietaryRestrictions={recipe.dietaryRestrictions}
              />
              <RecipeIngredients
                ingredients={recipe.ingredients}
              />
              <Typography variant="h5" component="h5" gutterBottom marginTop={'50px'}>
                Instructions:
              </Typography>
              <Box
                marginLeft={'30px'}
                marginRight={'30px'}
                marginBottom={'30px'}
              >
                <Typography variant="body1" component="p" gutterBottom>
                  {recipe.instructions.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </Typography>
              </Box>
            </Box>
          )
        )}
        <Button 
          variant="contained"
          sx={{ textTransform: "none", marginTop: '10px', marginBottom: '10px' }}
          onClick={() => navigate('/home')}
        >
          Back
        </Button>
      </Container>
    </div>
  );
}
