import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type RecipeIngredientsProps = {
  ingredients: {
    id: number;
    name: string;
    quantity: number;
    unit: string;
  }[];
}

export default function RecipeIngredients(props: RecipeIngredientsProps) {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        style={{ textAlign: 'center' }}
      >
        Ingredients
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          marginBottom: '15px',
          paddingLeft: '5px',
          paddingRight: '5px',
        }}
      >
        {props.ingredients.map((ingredient) => (
          <Box
            key={ingredient.id}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ccc',
            }}
          >
            <Typography
              variant="body1"
              component="span"
              textTransform='capitalize'
              fontWeight='bold'
            >
              {ingredient.name}
            </Typography>
            <Box>
              <Typography
                variant="body1"
                component="span"
                textTransform='capitalize'
                paddingRight='4px'
                >
                  {ingredient.quantity}
                </Typography>
                <Typography
                variant="body1"
                component="span"
                textTransform='capitalize'
                >
                  {ingredient.unit}
                </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
}