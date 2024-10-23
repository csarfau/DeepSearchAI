import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { theme } from '../../../App';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


interface TimeAgoProps {
    createdAt: string;
}

const formattedTime = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000); 

    const seconds = diff;
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
};


const TimeAgo: React.FC<TimeAgoProps> = ({ createdAt }) => {
    const [timePassed, setTimePassed] = useState<string>('');
    
    useEffect(() => {
        const updatePassedTime = () => {
            setTimePassed(formattedTime(createdAt));
        };

        updatePassedTime(); 

        const interval = setInterval(updatePassedTime, 60000); 

        return () => clearInterval(interval); 
    }, [createdAt]);

    return  (
        <Box sx={{display: 'flex', gap: '0.3rem', alignItems: 'center'}}>
            <AccessTimeIcon sx={{ width: '1rem', height: '1rem'}}/>
            <Typography variant='subtitle2' sx={{ color: theme.palette.text.secondary }}>{timePassed}</Typography>
        </Box>)
};

export default TimeAgo;
