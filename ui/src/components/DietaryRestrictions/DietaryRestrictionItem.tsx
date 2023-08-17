import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type DietaryRestrictionItemProps = {
  dietaryRestriction: string;
  onRemove: () => void;
};

export default function DietaryRestrictionItem(props: DietaryRestrictionItemProps) {
  const { dietaryRestriction, onRemove } = props;

  return (
    <Box
      key={dietaryRestriction}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "10px",
        border: "1px solid",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderRadius: "5px",
        marginBottom: "10px",
        marginRight: "10px",
      }}
    >
      <Box
        sx={{
          paddingRight: "10px",
        }}
      >
        {dietaryRestriction}
      </Box>
      <Button
        variant="contained"
        color="primary"
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          width: "20px",
          minWidth: "20px",
          minHeight: "20px",
          height: "30px",
        }}
        onClick={onRemove}
      >
        X
      </Button>
    </Box>
  );
}
