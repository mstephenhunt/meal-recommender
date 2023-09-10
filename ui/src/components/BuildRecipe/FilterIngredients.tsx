import React, { useState } from 'react';
import { FilterIngredient } from './build-recipe.service';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import { Typography } from '@mui/material';

type FilterIngredientsProps = {
  filterIngredients: FilterIngredient[] | null;
};

export default function FilterIngredients(props: FilterIngredientsProps) {
  const { filterIngredients } = props;

  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>('outlined');
  const [expandedAccordion, setExpandedAccordion] = useState<boolean>(false);

  const toggleButtonVariant = () => {
    setButtonVariant(buttonVariant === 'outlined' ? 'contained' : 'outlined');
    setExpandedAccordion(!expandedAccordion); // Toggle the accordion state
  };

  return (
    <div>
      <Button
        variant={buttonVariant}
        onClick={toggleButtonVariant}
        sx={{ width: '100%' }}
      >
        Ingredients
      </Button>
      <div
        className="accordion-content"
        style={{
          overflow: 'hidden',
          maxHeight: expandedAccordion ? '200px' : '0',
          transition: 'max-height 0.3s ease-in-out, visibility 0.5s ease-in-out',
          visibility: expandedAccordion ? 'visible' : 'hidden',
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            borderLeft: "1px solid",
            borderRight: "1px solid",
            borderBottom: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
          }}
        >
          <TextField
            label="Ingredient"
            variant="outlined"
            sx={{ marginTop: "20px", width: "66%" }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: "20px", width: "30%", fontWeight: "bold", textTransform: "none" }}
          >
            Add
          </Button>
        </Box>
      </div>
    </div>
  );
}
