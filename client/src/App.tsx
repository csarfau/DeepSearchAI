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
    gradients: {
      text: 'linear-gradient(147deg, rgba(151,0,209,1) 0%, rgba(157,0,200,1) 26%, rgba(222,0,105,1) 100%);'
    }
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

  // const InteractiveBubble: React.FC = () => {
  //   const [curX, setCurX] = useState(0);
  //   const [curY, setCurY] = useState(0);
  //   const [tgX, setTgX] = useState(0);
  //   const [tgY, setTgY] = useState(0);
  //   const animationFrameId = useRef<number | null>(null);

  //   useEffect(() => {
  //     const interBubble = document.querySelector<HTMLDivElement>('.interactive');

  //     const move = () => {
  //       setCurX((prevX) => prevX + (tgX - prevX) / 20);
  //       setCurY((prevY) => prevY + (tgY - prevY) / 20);

  //       if (interBubble) {
  //         interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
  //       }

  //       animationFrameId.current = requestAnimationFrame(move);
  //     };

  //     const handleMouseMove = (event: MouseEvent) => {
  //       setTgX(event.clientX);
  //       setTgY(event.clientY);
  //     };

  //     window.addEventListener('mousemove', handleMouseMove);

  //     animationFrameId.current = requestAnimationFrame(move);

  //     return () => {
  //       window.removeEventListener('mousemove', handleMouseMove);
  //       if (animationFrameId.current) {
  //         cancelAnimationFrame(animationFrameId.current); 
  //       }
  //     };
  //   }, [tgX, tgY, curX, curY]);

  //   return <div className="interactive">Interactive Bubble</div>;
  // };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <div className="App">
          {/* <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
              </filter>
            </defs>
          </svg>
          <div className="gradients-container">
            <div className="g1"></div>
            <div className="g2"></div>
            <div className="g3"></div>
            <div className="g4"></div>
            <InteractiveBubble />
          </div> */}
          <RouterProvider router={Router} />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;