import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import './App.css';
import Router from './Router';
import { createTheme } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#59198C',
    },
    secondary: {
      main: '#f1f1f1',
    },
    text: {
      primary: '#303030', 
      secondary: '#575757',
    },
    error: {
      main: '#b81515'
    },
    gradients: {
      text: 'linear-gradient(147deg, rgba(151,0,209,1) 0%, rgba(157,0,200,1) 26%, rgba(222,0,105,1) 100%);'
    },
  },
  borders: {
    primary: '1px solid #59198C', 
    secondary: '1px solid #e9e9e9',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px'
  },
  typography: {
    h4: {
      fontSize: '2.3rem',
      color: '#303030'
    },
    body2: {
      fontWeight: 'lighter',
      fontSize: '16px'
    },
    caption: {
      fontWeight: 100,
    },
    subtitle2: {
      fontWeight: 100,
      fontSize: '14px'
    }
  }
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <div className="App">
          <RouterProvider router={Router} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;