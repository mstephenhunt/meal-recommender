import React from "react";
import BotBase from "../BotBase/BotBase";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuBar from '../MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';

export default function MainMenuPage() {
  const navigate = useNavigate();

  const handleMakeNewRecipe = () => {
    navigate('/build-recipe');
  }

  return (
    <div>
      <MenuBar />
      <Container
        maxWidth="xs"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BotBase
          speechText="Welcome!"
        />
        <Button
          variant="contained"
          sx={{
            marginTop: "20px",
          }}
          onClick={handleMakeNewRecipe}
        >
          Make New Recipe
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/my-recipes')}
          sx={{
            marginTop: "20px",
          }}
        >
          See Previous Recipes
        </Button>
      </Container>
    </div>
  );
}
