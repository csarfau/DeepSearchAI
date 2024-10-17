import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import { useTheme } from '@mui/material/styles';
import { Home, Person, Receipt } from '@mui/icons-material';
import { Avatar, Grid2 as Grid, Typography} from '@mui/material';
import { theme } from '../../App';
import { iconsPath } from '../components/Icons';

export default function ResponsiveDrawer() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    const ListDrawer = () => {

        return (
            <Box
                sx={{                     
                    background: '#64447e',
                    height: '100vh',
                    ...(isSmallScreen && {p: '2rem' })                    
                }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List subheader={
                    <ListSubheader sx={{
                        bgcolor: 'inherit', 
                        height: '100%',
                        color: theme.palette.secondary.main,
                        fontSize: '1.2rem',
                        display: 'flex',
                        fontWeight: 600,
                        flexDirection: 'column',
                        alignItems: 'center',
                    }} component="div">
                        <Avatar sx={{width: '1.5rem', height: '1.5rem'}} alt="logo" src="/src/assets/images/round-logo.svg"/>
                        DeepSearchAI
                    </ListSubheader>
                }>
                    <Divider />
                    <ListItemButton sx={{mt: '1rem', 
                        ...(isSmallScreen ? {px: '1.5rem'} : { px: '0.5rem' })}}>
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Home'} 
                        />
                    </ListItemButton>
                    <ListItemButton sx={{  
                        ...(isSmallScreen ? {px: '1.5rem'} : { px: '0.5rem' }) }}>
                        <ListItemIcon>
                            <Person />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Profile'} 
                        />
                    </ListItemButton>
                    <ListItemButton sx={{  
                        ...(isSmallScreen ? {px: '1.5rem'} : { px: '0.5rem' }) }}>
                        <ListItemIcon>
                            <Receipt />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Query History'} 
                        />
                    </ListItemButton>
                </List>
            </Box>  
            )
    };

    return (
        <Box sx={{
            overflow: 'hidden',
            ...(!isSmallScreen && { minWidth: '15rem' }),      
        }}>
        {!isSmallScreen && (
            <Box
                sx={{
                    height: '95vh',
                    boxSizing: 'border-box',
                    borderRadius: '5px',
                }}
            >
                <ListDrawer />
            </Box>
        )}

        {isSmallScreen && (
            <>
                <Button onClick={toggleDrawer(true)} sx={{ 
                    position: 'fixed', bottom: 16, right: 16 }}>
                    Open Drawer
                </Button>
                <SwipeableDrawer
                    sx={{
                        maxWidth: '1px !important',
                    }}
                    anchor="left"
                    open={open}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                <ListDrawer />
                </SwipeableDrawer>
            </>
        )}
        </Box>
    );
}

export type SuggestionThemes = 
        'trip' |
        'cooking' |
        'art' |
        'technology' |
        'programming' |
        'politics' |
        'sport' |
        'history' |
        'music';

export type IUserSuggestion = {
    [key in SuggestionThemes]?: string;
};

export const SuggestionCard: React.FC<IUserSuggestion> = (suggestionTheme) => {
    const iconTypes = Object.keys(suggestionTheme) as SuggestionThemes[];

    return (
        <Grid container spacing={2} sx={{justifyContent: 'center'}}>
            {iconTypes.map((iconType) => (
                
                <Grid size={{ xs: 12, sm: 6 }} key={iconType} sx={{
                    maxWidth:{lg: '28rem'},
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    p: '0.5rem',
                    bgcolor: '#FFFFFF',
                    borderRadius: '10rem',
                    boxShadow: '0px 1px 1px #818181',
                    color: theme.palette.primary.main
                }}>
                    <Box
                        sx={{
                            width: '1.2rem', 
                            height: '1.2rem', 
                            background: 'linear-gradient(147deg, rgba(151,0,209,1) 0%, rgba(157,0,200,1) 26%, rgba(222,0,105,1) 100%)',
                            WebkitMaskImage: `url(${iconsPath[iconType]})`,
                            WebkitMaskSize: 'cover',
                            maskImage: `url(${iconsPath[iconType]})`,
                            maskSize: 'cover',
                        }}
                    />
                    <Typography variant="body1">{suggestionTheme[iconType]}</Typography>
                </Grid>
            ))}
        </Grid>
    );
};
