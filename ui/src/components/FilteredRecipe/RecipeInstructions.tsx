import React from 'react';
import Typography from '@mui/material/Typography';

type RecipeInstructionsProps = {
  instructions: string;
}

export default function RecipeInstructions(props: RecipeInstructionsProps) {
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
        Instructions
      </Typography>
      <Typography
        variant="body1"
        component="p"
        style={{
          marginTop: '10px',
          marginBottom: '10px',
        }}
      >
      {props.instructions.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
      </Typography>
    </div>
  );
}
