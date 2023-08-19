import React, { useEffect } from "react";
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { AuthService } from "../Login/auth.service";
import { useLocation } from 'react-router-dom';
import { RecipeService } from "./recipe.service";

type RecipeProps = {
  authService: AuthService;
}

export default function Recipe(props: RecipeProps) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recipeName = queryParams.get('recipeName');

  useEffect(() => {
    async function getRecipe() {
      const recipe = await RecipeService.getRecipe(recipeName!);
      console.log(recipe);
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
    </div>
  );
}