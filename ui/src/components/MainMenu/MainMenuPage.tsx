import React from "react";
import BotBase from "../BotBase/BotBase";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuBar from '../MenuBar/MenuBar';
import { useNavigate } from 'react-router-dom';
import { AuthService } from "../Login/auth.service";

type MainMenuPageProps = {
  authService: AuthService;
};

export default function MainMenuPage(props: MainMenuPageProps) {
  const { authService } = props;
  const navigate = useNavigate();

  const handleAddDietaryRestrictions = () => {
    navigate('/dietary-restrictions');
  };

  const handleSuggestRecipes = () => {
    navigate('/recipe-suggestor');
  };

  return (
    <div>
      <MenuBar 
        authService={authService}
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
          speechText="Welcome! Anything you'd like me to know?"
        />
        <Button
          variant="contained"
          sx={{
            height: "70px",
            width: "100%",
            marginTop: "20px",
            backgroundColor: "#53b94f",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handleSuggestRecipes}
        >
          Suggest Recipes
        </Button>
        <Button
          variant="contained"
          sx={{
            height: "70px",
            width: "100%",
            marginTop: "20px",
            backgroundColor: "#53b94f",
            fontWeight: "bold",
            textTransform: "none",
          }}
          onClick={handleAddDietaryRestrictions}
        >
          Add Dietary Restrictions
        </Button>
        <Button
          variant="contained"
          disabled
          sx={{
            height: "70px",
            width: "100%",
            marginTop: "20px",
            backgroundColor: "#53b94f",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Add Previous Meals
        </Button>
      </Container>
    </div>
  );
}
