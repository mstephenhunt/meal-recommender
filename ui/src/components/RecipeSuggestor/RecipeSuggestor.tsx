import React, { useEffect, useState } from 'react';
import { RecipeSuggestorService } from './recipe-suggestor.service';
import MenuBar from '../MenuBar/MenuBar';
import BotBase from '../BotBase/BotBase';
import Container from "@mui/material/Container";

export default function RecipeSuggestor(props: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  const { setIsLoggedIn } = props;

  const [recipeNames, setRecipeNames] = useState<string[]>([]);
  
  useEffect(() => {
    async function getRecipeNames() {
      const recipeNames = await RecipeSuggestorService.getRecipeNames();

      setRecipeNames(recipeNames);
    }

    getRecipeNames();
  }, []);

  return (
    <div>
      <MenuBar 
        setIsLoggedIn={setIsLoggedIn}
      />
      <Container
        maxWidth="xs"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BotBase
          speechText="Would you like to see any of these recipes?"
        />
        {recipeNames && recipeNames.length > 0 && (
          <div>
            {recipeNames.map((recipeName) => (
              <div>
                {recipeName}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}