import { useEffect, useState} from 'react';
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
import { ExpandLess, ExpandMore, History, Home, Person, Receipt } from '@mui/icons-material';
import { Avatar, CircularProgress, Collapse, ListItem, Typography } from '@mui/material';
import { useUser } from '../../../hooks/useUser';
import { createApiClient } from '../../../api/fetch';
import useToast from '../../../hooks/useToast';

interface IQueries {
    id: string,
    query: string,
    create_at: string
    handleClick: () => void
}

export default function ResponsiveDrawer() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const { user, token, isLoading: isUserLoading} = useUser();
    const showToast = useToast();

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

const QueryList = () => {
    const [queries, setQueries] = useState<Array<IQueries>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    
    const getRecentQueries = async () => {

        if (!isUserLoading && user && token) {
            setIsLoading(true);

            const apiClient = createApiClient({ token, userId: user.id });
            const response = await apiClient.getLatestQueries();
            
            if (response.error) return showToast(response.error);

            setQueries(response.data);
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        getRecentQueries();
    }, [user, token]);
    
    return (
        <Box>
            <ListItem
            sx={{ 
                borderRadius: '8px',
                '&:hover': {
                backgroundColor: theme.palette.action.hover,
                },
                cursor: 'pointer',
                px: isSmallScreen ? 3 : 1,
            }}
            >
            <ListItemIcon sx={{minWidth: '2rem'}}>
                <History sx={{color: theme.palette.secondary.main, width: '1.2rem'}} />
            </ListItemIcon>
            <ListItemText 
                primary={'Query History'} 
                sx={{color: theme.palette.secondary.main}}
            />
            </ListItem>
            <List 
                sx={{
                    width: '100%',
                    bgcolor: '#64447e',
                    borderLeft: '1px solid #bdbdbd',
                    ml: '1.1rem', 

                }}
            >
            {isLoading ? (
                <ListItem>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>Loading queries...</Typography>
                </ListItem>
            ) : queries.length > 0 ? (
                queries.map((queryData, index) => (
                <ListItem key={index} sx={{ 
                    px: 1,
                    py: 0,
                    '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    },
                }}>
                    <ListItemText
                        primary={queryData.query}
                        primaryTypographyProps={{ 
                            noWrap: true,
                            fontSize: '0.9rem',
                            sx: { 
                            color: theme.palette.secondary.main,
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }
                    }}
                    />
                </ListItem>
                ))
            ) : (
                <ListItem>
                    <Typography variant="body2" color="text.secondary">No recent queries found</Typography>
                </ListItem>
            )}
            </List>
        </Box>
    )
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
                        <ListItemIcon sx={{minWidth: '2rem'}}> 
                            <Home sx={{color: theme.palette.secondary.main, width: '1.2rem'}}/>
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Home'} 
                        />
                    </ListItemButton>
                    <ListItemButton sx={{  
                        ...(isSmallScreen ? {px: '1.5rem'} : { px: '0.5rem' }) }}>
                        <ListItemIcon sx={{minWidth: '2rem'}} >
                            <Person sx={{color: theme.palette.secondary.main, width: '1.2rem'}} />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Profile'} 
                        />
                    </ListItemButton>
                    {/* <ListItemButton sx={{  
                        ...(isSmallScreen ? {px: '1.5rem'} : { px: '0.5rem' }) }}>
                        <ListItemIcon>
                            <Receipt sx={{color: theme.palette.secondary.main, width: '1.3rem'}} />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Query History'} 
                        />
                    </ListItemButton> */}
                    <QueryList />
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