import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { Textarea } from '@mui/joy';


function TextAreaBox() {
  return (
    <>
      <Textarea  
        minRows={4}
        size='lg'
        placeholder='Search anything ...'
        sx={{
          width: '50%',
          mb: '15rem14'
        }}
      />
    </>
    
  );
}

function CenteredContainer() {
  return (

    <Box

      sx={{
        width: '98%',
        minHeight: '95vh',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        margin: 'auto', 
        backgroundColor: '#f5f5f51d', 
        backdropFilter: 'blur(10px)',
        borderRadius: 2, 
        boxShadow: 3, 
        zIndex: 3,
        p: '2rem',
        boxSizing: 'border-box'
      }}
    >
      <TextAreaBox  />
    </Box>
   
  );
}

function App() {

  const InteractiveBubble: React.FC = () => {
    const [curX, setCurX] = useState(0);
    const [curY, setCurY] = useState(0);
    const [tgX, setTgX] = useState(0);
    const [tgY, setTgY] = useState(0);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
      const interBubble = document.querySelector<HTMLDivElement>('.interactive');

      const move = () => {
        setCurX((prevX) => prevX + (tgX - prevX) / 20);
        setCurY((prevY) => prevY + (tgY - prevY) / 20);

        if (interBubble) {
          interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        }

        animationFrameId.current = requestAnimationFrame(move);
      };

      const handleMouseMove = (event: MouseEvent) => {
        setTgX(event.clientX);
        setTgY(event.clientY);
      };

      window.addEventListener('mousemove', handleMouseMove);

      animationFrameId.current = requestAnimationFrame(move);

      // Limpeza quando o componente é desmontado
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current); // Cancelar o frame de animação quando o componente for desmontado
        }
      };
    }, [tgX, tgY, curX, curY]);

    return <div className="interactive">Interactive Bubble</div>;
  };

  return (
    <>
      <div className="App">
        <svg xmlns="http://www.w3.org/2000/svg">
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
          <div className="g5"></div>
          <InteractiveBubble />
        </div>
        <CenteredContainer/>
      </div>
    </>
  );
}

export default App;

