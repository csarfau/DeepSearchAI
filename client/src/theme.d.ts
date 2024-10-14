import { Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
        borders: {
            primary: string;
            secondary?: string;
        };
        borderRadius: {
          small: string;
          medium: string;
          large: string;
        };
  }

  interface ThemeOptions {
    borders?: {
        primary?: string;
        secondary?: string;
    };
    borderRadius?: {
        small?: string;
        medium?: string;
        large?: string;
    };
  }
  
}
