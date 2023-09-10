import React, { useState, useEffect } from 'react';
import { FilterIngredient } from './build-recipe.service';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import FilterItem from './FilterItem';
import { useInternalRequest } from '../../services/internal-request';
import { BuildRecipeService } from './build-recipe.service';

type FilterIngredientsProps = {
  filterIngredients: FilterIngredient[] | null;
  setFilterIngredients: (filterIngredients: FilterIngredient[]) => void;
};

export default function FilterIngredients(props: FilterIngredientsProps) {
  const { filterIngredients, setFilterIngredients } = props;
  const internalRequest = useInternalRequest();

  const [currentFilterIngredient, setCurrentFilterIngredient] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilterIngredient(event.target.value);
  };

  const handleSaveFilterIngredient = async () => {
    if (currentFilterIngredient.trim() !== '') {
      const newFilterIngredient = await BuildRecipeService.saveFilterIngredient({
        internalRequest,
        ingredientName: currentFilterIngredient,
      });

      setFilterIngredients([...(filterIngredients ?? []), newFilterIngredient]);
      setCurrentFilterIngredient('');
    }
  };

  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>('outlined');
  const [expandedAccordion, setExpandedAccordion] = useState<boolean>(false);

  const toggleButtonVariant = () => {
    setButtonVariant(buttonVariant === 'outlined' ? 'contained' : 'outlined');
    setExpandedAccordion(!expandedAccordion);
  };

  const handleRemoveFilterIngredient = (id: number) => {
    const newFilterIngredients = filterIngredients?.filter((filterIngredient) => filterIngredient.id !== id);
    setFilterIngredients(newFilterIngredients ?? []);

    BuildRecipeService.deleteFilterIngredient({
      internalRequest,
      ingredientId: id,
    });
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
          maxHeight: expandedAccordion ? undefined : '0',
          transition: 'max-height 0.3s ease-in-out, visibility 0.5s ease-in-out',
          visibility: expandedAccordion ? 'visible' : 'hidden',
        }}
      >
        <Box
          sx={{
            borderLeft: "1px solid",
            borderRight: "1px solid",
            borderBottom: "1px solid",
            borderColor: "rgba(0, 0, 0, 0.23)",
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingBottom: '10px',
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: '10px'
            }}
          >
            <TextField
              label="Ingredient"
              variant="outlined"
              value={currentFilterIngredient}
              onChange={handleInputChange}
              sx={{ marginTop: "20px", width: "66%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveFilterIngredient}
              sx={{ marginTop: "20px", width: "30%", fontWeight: "bold", textTransform: "none" }}
            >
              Add
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {filterIngredients?.map((filterIngredient) => (
              <FilterItem
                key={filterIngredient.id}
                id={filterIngredient.id}
                name={filterIngredient.displayName}
                onRemove={handleRemoveFilterIngredient}
              />
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
}
