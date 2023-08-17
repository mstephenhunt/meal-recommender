import React from "react";
import BotBase from "../BotBase/BotBase";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function MainMenuPage() {
  return (
    <Container
      maxWidth="xs"
      style={{
        height: "100vh",
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
        }}
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
        }}
      >
        Add Dietary Restrictions
      </Button>
      <Button
        variant="contained"
        sx={{
          height: "70px",
          width: "100%",
          marginTop: "20px",
          backgroundColor: "#53b94f",
          fontWeight: "bold",
        }}
      >
        Add Previous Meals
      </Button>
    </Container>
  );
}
