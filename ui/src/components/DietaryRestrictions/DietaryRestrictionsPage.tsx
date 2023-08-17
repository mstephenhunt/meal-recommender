import React from "react";
import MenuBar from '../MenuBar/MenuBar';
import BotBase from "../BotBase/BotBase";
import Container from "@mui/material/Container";

export default function DietaryRestrictionsPage() {
  return (
    <div>
      <MenuBar />
      <Container
        maxWidth="xs"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BotBase
          speechText="What are your dietary restrictions?"
        />
      </Container>
    </div>
  )
}