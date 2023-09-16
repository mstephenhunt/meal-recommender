import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type ReactTitleProps = {
  title: string;
  dietaryRestrictions: {
    id: number;
    name: string;
  }[];
}

export default function RecipeTitle(props: ReactTitleProps) {
  return (
    <div>
      <Typography
        variant="h4"
        component="h1"
        style={{ textAlign: 'center' }}
      >
        {props.title}
      </Typography>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          marginBottom: '15px'
        }}
      >
        {props.dietaryRestrictions.map((restriction) => (
          <Box
            key={restriction.id}
            sx={{
              backgroundColor: 'lightgrey',
            }}
            borderRadius={16}
            padding={1}
            margin={1}
          >
            <span
              style={{
                textTransform: 'capitalize',
              }}
            >{restriction.name}</span>
          </Box>
        ))}
      </Box>
    </div>
  );
}