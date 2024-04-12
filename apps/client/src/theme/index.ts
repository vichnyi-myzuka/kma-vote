import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {}
  interface ThemeOptions {}
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0046de',
    },
  },
  typography: {
    fontFamily: 'FixelDisplay, sans-serif',
  },
});
