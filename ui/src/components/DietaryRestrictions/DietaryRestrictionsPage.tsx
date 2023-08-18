import React, { useState, useEffect } from "react";
import MenuBar from '../MenuBar/MenuBar';
import BotBase from "../BotBase/BotBase";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import DietaryRestrictionItem from "./DietaryRestrictionItem";
import { useNavigate } from "react-router-dom";
import { DietaryRestrictionsService } from "./dietary-restrictions.service";

export default function DietaryRestrictionsPage(props: { setIsLoggedIn: (isLoggedIn: boolean) => void }) {
  const { setIsLoggedIn } = props;
  
  const [currentDietaryRestriction, setCurrentDietaryRestriction] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);

  const navigate = useNavigate();

  const handleDone = () => {
    navigate('/home');
  };

  useEffect(() => {
    // Fetch dietary restrictions and set them in the state
    const fetchDietaryRestrictions = async () => {
      try {
        const restrictions = await DietaryRestrictionsService.getCurrentDietaryRestrictions();
        setDietaryRestrictions(restrictions);
      } catch (error) {
        console.error("Error fetching dietary restrictions:", error);
      }
    };

    fetchDietaryRestrictions();
  }, []); // Empty dependency array ensures it only runs on mount

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDietaryRestriction(event.target.value);
  };

  const handleSaveDietaryRestriction = () => {
    if (currentDietaryRestriction.trim() !== "") {
      setDietaryRestrictions([...dietaryRestrictions, currentDietaryRestriction]);
      setCurrentDietaryRestriction("");

      DietaryRestrictionsService.saveDietaryRestriction(currentDietaryRestriction);
    }
  };

  const handleRemoveDietaryRestriction = (index: number) => {
    const toDelete = dietaryRestrictions[index];
    DietaryRestrictionsService.deleteDietaryRestriction(toDelete);

    const updatedRestrictions = [...dietaryRestrictions];
    updatedRestrictions.splice(index, 1);
    setDietaryRestrictions(updatedRestrictions);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
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
            width: "auto",
            height: "auto",
            minHeight: "100px",
            marginTop: "15px",
            padding: "10px",
            border: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
            borderRadius: "5px",
            flexGrow: 1,
          }}
        > 
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {dietaryRestrictions.map((dietaryRestriction, index) => (
            <DietaryRestrictionItem
              key={index}
              dietaryRestriction={dietaryRestriction}
              onRemove={() => handleRemoveDietaryRestriction(index)}
            />
          ))}
        </Box>
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
              marginBottom: "20px",
              width: "100%", 
              fontWeight: "bold", 
              textTransform: "none" ,
              height: "70px",
            }}
            onClick={handleDone}
          >
            Done
          </Button>
        </Box>
      </Container>
    </div>
  )
}
