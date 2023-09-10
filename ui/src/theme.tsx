import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    contrastThreshold: 1,
    primary: {
      main: '#04AABD',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
      },
    },
  },
});

export default theme;
