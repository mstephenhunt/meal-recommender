import React, { useState } from "react";
import MenuBar from '../MenuBar/MenuBar';
import BotBase from "../BotBase/BotBase";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

export default function DietaryRestrictionsPage() {
  const [currentDietaryRestriction, setCurrentDietaryRestriction] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDietaryRestriction(event.target.value);
  };

  const handleSaveDietaryRestriction = () => {
    if (currentDietaryRestriction.trim() !== "") {
      setDietaryRestrictions([...dietaryRestrictions, currentDietaryRestriction]);
      setCurrentDietaryRestriction("");
    }
  };

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TextField
              label="Dietary Restriction"
              variant="outlined"
              value={currentDietaryRestriction}
              onChange={handleInputChange}
              sx={{ marginTop: "20px", width: "66%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveDietaryRestriction}
              sx={{ marginTop: "20px", width: "30%", fontWeight: "bold", textTransform: "none" }}
            >
              Add
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            width: "auto%",
            height: "auto",
            minHeight: "100px",
            marginTop: "15px",
            padding: "10px",
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: "5px",
          }}
        >
          Dietary Restrictions Here
        </Box>
        <Box
          sx={{
            justifySelf: "flex-end",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{ 
              marginTop: "20px", 
              width: "100%", 
              fontWeight: "bold", 
              textTransform: "none" ,
              height: "70px",
            }}
          >
            Done
          </Button>
        </Box>
      </Container>
    </div>
  )
}
