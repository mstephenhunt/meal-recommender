import { createTheme } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
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
        contained: {
          color: 'white',
        },
        outlined: {
          borderColor: '#CFCFCF',
          color: 'black',
        }
      },
    },
  },
});

export default theme;
