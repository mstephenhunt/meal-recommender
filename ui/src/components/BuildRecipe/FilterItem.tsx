import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type FilterItemProps = {
  id: number
  name: string;
  onRemove: (id: number) => void;
};

export default function FilterItem(props: FilterItemProps) {
  const { id, name, onRemove } = props;

  return (
    <Box
      key={id}
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
        width: "fit-content",
      }}
    >
      <Box
        sx={{
          paddingRight: "10px",
        }}
      >
        {name}
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
        onClick={() => onRemove(id)}
      >
        X
      </Button>
    </Box>
  );
}
