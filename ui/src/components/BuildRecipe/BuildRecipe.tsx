import React, { useEffect, useState } from 'react';
import MenuBar from "../MenuBar/MenuBar";
import BotBase from "../BotBase/BotBase";
import { useInternalRequest } from '../../services/internal-request';
import { BuildRecipeService, FilterIngredient, FilterDiet, FilterAllergen } from './build-recipe.service';
import { Container } from '@mui/material';
import FilterIngredients from './FilterIngredients';
import FilterDiets from './FilterDiets';
import FilterAllergens from './FilterAllergens';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function BuildRecipe() {
  const internalRequest = useInternalRequest();
  const navigate = useNavigate();
  
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
  }, [filterIngredients, internalRequest, isLoadingFilterIngredients]);

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
  }, [filterDiets, internalRequest, isLoadingFilterDiets]);

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
  }, [filterAllergens, internalRequest, isLoadingFilterAllergens]);

  function handleBack() {
    navigate('/home');
  }

  function handleNext() {
    navigate('/recipe-name-suggestor');
  }

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
          height: "50vh",
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
        <div style={{paddingTop: '15px'}} />
        <FilterAllergens
          filterAllergens={filterAllergens}
          setFilterAllergens={setFilterAllergens}
        />
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: "15px",
            paddingBottom: "15px",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              minWidth: "120px",
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              minWidth: "120px",
            }}
          >
            Next
          </Button>
        </div>
      </Container>
    </div>
  );
}