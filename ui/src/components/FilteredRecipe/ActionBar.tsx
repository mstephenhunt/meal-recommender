import React, { useState } from "react";
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';

type ActionBarProps = {
  recipeId: number;
};

export default function ActionBar({ recipeId }: ActionBarProps) {
  const [openShareSnackbar, setOpenShareSnackbar] = useState(false);
  
  const currentHost = window.location.host;
  const shareRecipeUrl = `${currentHost}/filtered-recipe?recipeId=${recipeId}`;

  const handleShareClick = async () => {
    try {
      await navigator.clipboard.writeText(shareRecipeUrl);
      
      setOpenShareSnackbar(true);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy recipe URL to clipboard.");
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: "center", width: "100%", marginBottom: "10px", marginTop: "10px" }}>
      <Button
        sx={{
          minWidth: "40%",
        }}
        variant="contained"
        startIcon={<ShareIcon />}
        onClick={handleShareClick}
      >
        Share
      </Button>
      <Box sx={{width: "10%"}} />
      <Button
        disabled
        sx={{
          minWidth: "40%",
        }}
        variant="contained"
        startIcon={<FavoriteIcon />}
      >
        Favorite
      </Button>
      <Snackbar
        open={openShareSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenShareSnackbar(false)}
        message="Recipe URL copied to clipboard!"
      />
    </Box>
  );
}
