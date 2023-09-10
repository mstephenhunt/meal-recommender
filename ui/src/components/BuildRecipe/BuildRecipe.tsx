import React, { useEffect, useState } from 'react';
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { useInternalRequest } from '../../services/internal-request';
import { BuildRecipeService, FilterIngredient, FilterDiet, FilterAllergen } from './build-recipe.service';
import { Container } from '@mui/material';
import FilterIngredients from './FilterIngredients';
import FilterDiets from './FilterDiet';

export default function BuildRecipe() {
  const internalRequest = useInternalRequest();
  
  const [isLoadingFilterIngredients, setIsLoadingFilterIngredients] = useState<boolean>(false);
  const [filterIngredients, setFilterIngredients] = useState<FilterIngredient[] | null>(null);
  
  const [isLoadingFilterDiets, setIsLoadingFilterDiets] = useState<boolean>(false);
  const [filterDiets, setFilterDiets] = useState<FilterDiet[] | null>(null);

  const [isLoadingFilterAllergens, setIsLoadingFilterAllergens] = useState<boolean>(false);
  const [filterAllergens, setFilterAllergens] = useState<FilterAllergen[] | null>(null);

  useEffect(() => {
    async function getFilterIngredients() {
      try {
        setIsLoadingFilterIngredients(true);
        const filterIngredients = await BuildRecipeService.getFilterIngredients({
          internalRequest,
        });
        setFilterIngredients(filterIngredients);
      } catch (error) {
        console.error(error);
      }
      
      setIsLoadingFilterIngredients(false);
    }

    if (filterIngredients === null && !isLoadingFilterIngredients) {
      getFilterIngredients();
    }
  }, [filterIngredients, internalRequest]);

  useEffect(() => {
    async function getFilterDiets() {
      try {
        setIsLoadingFilterDiets(true);
        const filterDiets = await BuildRecipeService.getFilterDiets({
          internalRequest,
        });
        setFilterDiets(filterDiets);
      } catch (error) {
        console.error(error);
      }

      setIsLoadingFilterDiets(false);
    }

    if (filterDiets === null && !isLoadingFilterDiets) {
      getFilterDiets();
    }
  }, [filterDiets, internalRequest]);

  useEffect(() => {
    async function getFilterAllergens() {
      try {
        setIsLoadingFilterAllergens(true);
        const filterAllergens = await BuildRecipeService.getFilterAllergens({
          internalRequest,
        });
        setFilterAllergens(filterAllergens);
      } catch (error) {
        console.error(error);
      }

      setIsLoadingFilterAllergens(false);
    }

    if (filterAllergens === null && !isLoadingFilterAllergens) {
      getFilterAllergens();
    }
  }, [filterAllergens, internalRequest]);

  return (
    <div>
      <MenuBar />
      <BotBase
        speechText="How would you like to make your recipe?"
      />
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FilterIngredients
          filterIngredients={filterIngredients}
          setFilterIngredients={setFilterIngredients}
        />
        <div style={{paddingTop: '15px'}} />
        <FilterDiets
          filterDiets={filterDiets}
          setFilterDiets={setFilterDiets}
        />
      </Container>
    </div>
  );
}