import React, { useState, useEffect } from 'react';
import { FilterAllergen } from './build-recipe.service';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import FilterItem from './FilterItem';
import { useInternalRequest } from '../../services/internal-request';
import { BuildRecipeService } from './build-recipe.service';

type FilterAllergensProps = {
  filterAllergens: FilterAllergen[] | null;
  setFilterAllergens: (filterAllergens: FilterAllergen[]) => void;
};

export default function FilterAllergens(props: FilterAllergensProps) {
  const { filterAllergens, setFilterAllergens } = props;
  const internalRequest = useInternalRequest();

  const [currentFilterAllergen, setCurrentFilterAllergen] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilterAllergen(event.target.value);
  };

  const handleSaveFilterAllergen = async () => {
    if (currentFilterAllergen.trim() !== '') {
      const newFilterAllergen = await BuildRecipeService.saveFilterAllergen({
        internalRequest,
        allergenName: currentFilterAllergen,
      });

      setFilterAllergens([...(filterAllergens ?? []), newFilterAllergen]);
      setCurrentFilterAllergen('');
    }
  };

  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>('outlined');
  const [expandedAccordion, setExpandedAccordion] = useState<boolean>(false);

  const toggleButtonVariant = () => {
    setButtonVariant(buttonVariant === 'outlined' ? 'contained' : 'outlined');
    setExpandedAccordion(!expandedAccordion);
  };

  const handleRemoveFilterAllergen = (id: number) => {
    const newFilterAllergens = filterAllergens?.filter((filterAllergen) => filterAllergen.id !== id);
    setFilterAllergens(newFilterAllergens ?? []);

    BuildRecipeService.deleteFilterAllergen({
      internalRequest,
      allergenId: id,
    });
  };

  return (
    <div>
      <Button
        variant={buttonVariant}
        onClick={toggleButtonVariant}
        sx={{ width: '100%' }}
      >
        Allergens
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
              label="Allergen"
              variant="outlined"
              value={currentFilterAllergen}
              onChange={handleInputChange}
              sx={{ marginTop: "20px", width: "66%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveFilterAllergen}
              sx={{ marginTop: "20px", width: "30%", fontWeight: "bold", textTransform: "none" }}
            >
              Add
            </Button>
          </Box>
          {filterAllergens?.map((filterAllergen) => (
            <FilterItem
              key={filterAllergen.id}
              id={filterAllergen.id}
              name={filterAllergen.displayName}
              onRemove={handleRemoveFilterAllergen}
            />
          ))}
        </Box>
      </div>
    </div>
  );
}
