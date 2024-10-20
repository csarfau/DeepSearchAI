import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import { theme } from '../../../App';
import { LinearProgress, LinearProgressProps } from '@mui/material';

const steps = [
    {
        label: 'Gathering Data Sources',
        description: 'Fetching relevant web pages for your query.',
        duration: 3000, 
        progress: 20,
    },
    {
        label: 'Evaluating Results',
        description: 'Our AI is carefully analyzing the results to determine the most reliable and informative sources',
        duration: 5000,
        progress: 60,
    },
    {
        label: 'Building Your Answer',
        description: 'Now, our AI is synthesizing the data from the top results and crafting a comprehensive response.',
        duration: 5000, 
        progress: 100,
    },
];

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{width: '100%', display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1,  }}>
          <LinearProgress variant="determinate"  value={props.value}/>
        </Box>  
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ color: 'text.secondary' }}
          >{`${props.value}%`}</Typography>
        </Box>
      </Box>
    );
}

export default function StepperContainer() {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (activeStep < steps.length) {
        const timer = setTimeout(() => {
            setActiveStep((prevStep) => prevStep + 1);
            setProgress(steps[activeStep].progress);
        }, steps[activeStep].duration);

        return () => clearTimeout(timer);
        }
    }, [activeStep]);

  return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '2rem', 
            alignItems: 'center', 
            justifyContent: 'start',
            height: '100%',
            pt: '3rem',
            boxSizing: 'border-box'
        }}>
            <Box sx={{textAlign: 'center'}}>
                <Typography variant='h5' color={theme.palette.text.primary}>
                    Your Answer in Progress
                </Typography>
                <Typography variant='body2' color={theme.palette.text.secondary} >
                    Follow the steps as we gather, evaluate, and craft the best possible response to your query.
                </Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={progress} />
            </Box>
            <Box sx={{
                display: 'flex', 
                justifyContent: 'center',
                gap: '0.5rem'
                }}>
                <Box sx={{ width: '15rem' }}>
                    <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((step) => (
                        <Step key={step.label}>
                        <StepLabel>
                            {step.label}
                        </StepLabel>
                        <StepContent>
                            <Typography variant='body2' sx={{ color: theme.palette.text.secondary}}>{step.description}</Typography>
                        </StepContent>
                        </Step>
                    ))}
                    </Stepper>
                </Box>
            </Box>
        </Box>
  );
}

