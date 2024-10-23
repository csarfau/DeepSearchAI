import { Grid2 as Grid } from '@mui/material';
import { Button, Paper, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { createApiClient, ITheme } from '../../api/fetch';
import {  OptionThemeCard, SkeletonThemeCard } from './partial';
import { iconsPath } from '../components/Icons'
import  useToast  from '../../hooks/useToast';
import { useUser } from '../../hooks/useUser';
import { useNavigate } from 'react-router-dom';

const SuggestionPage = () => {
    const theme = useTheme();
    const [themesSuggestions, setThemesSuggestions] = useState<Array<ITheme>>([]);
    const [loading, setLoading] = useState(true);
    const [themeDefinition, setThemeDefinition] = useState<Array<string>>([]); 
    const [isVisible, setIsVisible] = useState(false);
    const showToast = useToast();
    const { user, token, isLoading: isUserLoading} = useUser();
    const navigate = useNavigate();

    const handleThemeChoice = (newThemeID:string) => {
        setThemeDefinition(prev => prev.includes(newThemeID) ? prev.filter(themeID => themeID !== newThemeID) :  [...prev, newThemeID]);
    }

    const handleSaveThemes = async (selectedThemes: string[]) => {
        if (user && token) {
            const apiClient = createApiClient({ token, userId: user.id });
            const response = await apiClient.saveUserThemes(selectedThemes);
            if(response.error) return showToast(response.error);
            
            navigate('/chat');
        }
    };

    useEffect(() => {

        const loadThemes = async () => {
            if (!isUserLoading && user && token) {
                const apiClient = createApiClient({ token, userId: user.id });
                const response = await apiClient.fetchThemes();
                
                if (response.error) return showToast(response.error);
                setThemesSuggestions(response.data);
                setLoading(false);
            }
            
            return 
        };
        
        setTimeout(() => {
            setIsVisible(true);
        }, 100);

        loadThemes();
    }, [user, token, isUserLoading]);
        
    return (
        <Box sx={{
                px: 0,
                width: '100%',
                transition: 'transform 1s ease-in-out', 
                transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
                display: 'flex',
                justifyContent: 'center'
            }}>
            <Paper elevation={2} sx={{
                minHeight: '95vh',
                width: '90%',
                boxSizing: 'border-box',
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                py: '2rem',
                backgroundColor: theme.palette.secondary.main,
                border: theme.borders.secondary,
                
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
                <Button onClick={() => handleSaveThemes(themeDefinition)} sx={{ width: { xs: '70%', sm: '15rem' }}} size='medium' variant='contained'>Confirm</Button>
            </Paper>
        </Box>
    )
}

export default SuggestionPage;