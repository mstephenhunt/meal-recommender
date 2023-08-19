import React, { useEffect, useState } from "react";
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { AuthService } from "../Login/auth.service";
import { useLocation } from 'react-router-dom';
import { RecipeService, Recipe as APIRecipe } from "./recipe.service";

type RecipeProps = {
  authService: AuthService;
}

export default function Recipe(props: RecipeProps) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipeName = queryParams.get('recipeName');

  const [recipe, setRecipe] = useState<APIRecipe | null>(null);

  useEffect(() => {
    async function getRecipe() {
      const recipeData = await RecipeService.getRecipe(recipeName!);
      setRecipe(recipeData);
    }

    getRecipe();
  }, []);

  return (
    <div>
      <MenuBar
        authService={props.authService}
      />
      <BotBase
        speechText="Here is your recipe!"
      />
      {recipe && (
        <div>
          <h1>{recipe.name}</h1>
          <h2>Ingredients:</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.quantity} {ingredient.unit} - {ingredient.name}
              </li>
            ))}
          </ul>
          <h2>Instructions:</h2>
          <p>{recipe.instructions}</p>
        </div>
      )}
    </div>
  );
}
