import React, { useState } from 'react';
import { FilterDiet } from './build-recipe.service';
import { Button } from '@mui/material';
import { Box } from '@mui/system';
import { TextField } from '@mui/material';
import FilterItem from './FilterItem'; // You may need to adjust this import
import { useInternalRequest } from '../../services/internal-request';
import { BuildRecipeService } from './build-recipe.service';

type FilterDietProps = {
  filterDiets: FilterDiet[] | null;
  setFilterDiets: (filterDiets: FilterDiet[]) => void;
};

export default function FilterDiets(props: FilterDietProps) {
  const { filterDiets, setFilterDiets } = props;
  const internalRequest = useInternalRequest();

  const [currentFilterDiet, setCurrentFilterDiet] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilterDiet(event.target.value);
  };

  const handleSaveFilterDiet = async () => {
    if (currentFilterDiet.trim() !== '') {
      const newFilterDiet = await BuildRecipeService.saveFilterDiet({
        internalRequest,
        dietName: currentFilterDiet,
      });

      setFilterDiets([...(filterDiets ?? []), newFilterDiet]);
      setCurrentFilterDiet('');
    }
  };

  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>('outlined');
  const [expandedAccordion, setExpandedAccordion] = useState<boolean>(false);

  const toggleButtonVariant = () => {
    setButtonVariant(buttonVariant === 'outlined' ? 'contained' : 'outlined');
    setExpandedAccordion(!expandedAccordion);
  };

  const handleRemoveFilterDiet = (id: number) => {
    const newFilterDiets = filterDiets?.filter((filterDiet) => filterDiet.id !== id);
    setFilterDiets(newFilterDiets ?? []);

    BuildRecipeService.deleteFilterDiet({
      internalRequest,
      dietId: id,
    });
  };

  return (
    <div>
      <Button
        variant={buttonVariant}
        onClick={toggleButtonVariant}
        sx={{ width: '100%' }}
      >
        Diets
      </Button>
      <div
        className="accordion-content"
        style={{
          overflow: 'hidden',
          maxHeight: expandedAccordion ? '100%' : '0',
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
              label="Diet"
              variant="outlined"
              value={currentFilterDiet}
              onChange={handleInputChange}
              sx={{ marginTop: "20px", width: "66%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveFilterDiet}
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
            {filterDiets?.map((filterDiet) => (
              <FilterItem
                key={filterDiet.id}
                id={filterDiet.id}
                name={filterDiet.displayName}
                onRemove={handleRemoveFilterDiet}
              />
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
}
