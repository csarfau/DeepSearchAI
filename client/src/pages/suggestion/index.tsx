import { Grid2 as Grid } from '@mui/material';
import { Button, Container, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { fetchThemes, ITheme, saveUserThemes } from '../../api/fetch';
import {  OptionThemeCard, SkeletonThemeCard } from './partial';
import { iconsPath } from '../components/Icons'
import  useToast  from '../../hooks/useToast';

const SuggestionPage = () => {
    const theme = useTheme();
    const [themesSuggestions, setThemesSuggestions] = useState<Array<ITheme>>([]);
    const [loading, setLoading] = useState(true);
    const [themeDefinition, setThemeDefinition] = useState<Array<string>>([]); 
    const [isFinishedDefinition, setIsFinishedDefinition] = useState(false);
    const showToast = useToast();

    const handleThemeChoice = (newThemeID:string) => {
        setThemeDefinition(prev => prev.includes(newThemeID) ? prev.filter(themeID => themeID !== newThemeID) :  [...prev, newThemeID]);
    }

    const saveDefinition = async () => {
        if (themeDefinition.length < 4) return; 

        const response = await saveUserThemes('45015b5e-0862-4942-a823-17aa20514b99', themeDefinition);

        if (response.error) {
            return showToast(response.error, 'error');
        }
        
        setIsFinishedDefinition(true);
    }

    useEffect(() => {

        const getThemes = async () => {
            const { data, error } = await fetchThemes();     
            setLoading(false);
            data ? setThemesSuggestions(data) : showToast(error as string, 'error');
        };

        getThemes(); 
    }, []);
        
    return (
        <Container sx={{
            px: 0,
            transition: 'transform 0.8s ease-in-out', 
            ...(isFinishedDefinition && {
                transform: 'translateX(-120%)'
            })
            }}>
            <Paper elevation={2} sx={{
                minHeight: '95vh',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                py: '2rem',
                backgroundColor: theme.palette.secondary.main,
                border: theme.borders.secondary
            }}>
                <Box sx={{textAlign: 'center'}}>
                    <Typography variant='h4'>
                        What are you interested in?
                    </Typography>
                    <Typography variant='body2' sx={{color: theme.palette.text.secondary, px: '0.5rem'}}>
                        Choose Your Preferences for Personalized AI Suggestions
                    </Typography>
                </Box>
                <Grid container spacing={2} justifyContent="center" sx={{ px: '1rem', boxSizing: 'border-box', maxWidth: '30rem'}}>
                    {loading ? (
                        Array.from({ length: 9 }).map((_, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 4 }}>
                                <SkeletonThemeCard />
                            </Grid>
                        ))
                    ) : (
                        themesSuggestions.map((themeSuggestion, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 4 }}>
                                <OptionThemeCard 
                                    label={themeSuggestion.name as keyof typeof iconsPath} 
                                    variant={index % 2 === 0 ? 'outlined' : 'contained'} 
                                    onClick={() => handleThemeChoice(themeSuggestion.id)}
                                    isSelected={themeDefinition.includes(themeSuggestion.id)}
                                />
                            </Grid>
                        ))
                    )}
                    <Typography variant='subtitle2' sx={{ alignSelf:'start'}}><span className='span-primary'>Obs:</span> You must select at least four interest themes.</Typography>
                </Grid>
                <Button onClick={() => saveDefinition()} sx={{ width: { xs: '70%', sm: '15rem' }}} size='medium' variant='contained'>Confirm</Button>
            </Paper>
        </Container>
    )
}

export default SuggestionPage;