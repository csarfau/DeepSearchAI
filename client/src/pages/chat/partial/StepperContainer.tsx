import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepIcon, { StepIconProps } from '@mui/material/StepIcon';
import Typography from '@mui/material/Typography';
import { CircularProgress, LinearProgress, LinearProgressProps } from '@mui/material';
import { theme } from '../../../App';
import { ResponseStreamType } from '../../../api/fetch';

const steps = [
    {
        label: 'Fetching relevant web pages for your query.',
    },
    {
        label: 'Our AI is carefully analyzing the results to determine the most reliable and informative sources',
    },
    {
        label: 'Now, our AI is synthesizing the data from the top results and crafting a comprehensive response.',
    },
];

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={props.value} />
            </Box>  
            <Box>
                <Typography
                    variant="subtitle2"
                    sx={{ 
                        color: 'text.secondary', 
                    }}
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

interface StepperContainerProps {
    currentStep: ResponseStreamType;
}

const CustomStepIcon: React.FC<StepIconProps> = (props) => {
    const { active } = props;
    return (
        <StepIcon
            {...props}
            sx={{
                color: active ? theme.palette.primary.main : theme.palette.primary.light,
            }}
        />
    );
};

const StepperContainer: React.FC<StepperContainerProps> = ({ currentStep }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        switch (currentStep) {
            case 'init':
                setActiveStep(0);
                setProgress(0);
                break;
            case 'firstStep':
                setActiveStep(1);
                setProgress(10);
                break;
            case 'secondStep':
                setActiveStep(2);
                setProgress(40);
                break;
            case 'thirdStep':
                setActiveStep(3);
                setProgress(99);
                break;
            case 'content':
                setActiveStep(3);
                setProgress(100);
                break;
        }
    }, [currentStep]);

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
                <Typography variant='body2' color={theme.palette.text.secondary}>
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
                    {steps.map((step, index) => (
                        <Step key={index} sx={{ position: 'relative' }}>
                            {index === activeStep &&
                            <CircularProgress sx={{ 
                                position: 'absolute',
                                left: '-2rem'
                            }}
                                color="primary" 
                                size={16}
                                />
                            }
                            <StepLabel
                                StepIconComponent={CustomStepIcon}
                                sx={{
                                    '& .MuiStepLabel-label': {
                                        color: index === activeStep ? theme.palette.text.primary : theme.palette.text.secondary,
                                    },
                                }}
                            >
                                {step.label}
                            </StepLabel>
                        </Step>
                    ))}
                    </Stepper>
                </Box>
            </Box>
        </Box>
    );
}

export default StepperContainer;