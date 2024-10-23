import { useState} from 'react';
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
import {  Home, Person } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import MemoizedQueryList, { IQueryList } from './QueryList'; 
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from '../../hooks/useUser';

const SideBard:React.FC<IQueryList> = (queryListProps) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
    const navigate = useNavigate();
    const { logout } = useUser();

    const toggleDrawer = (open: boolean) => () => {
        setOpen(open);
    };

    const ListDrawer = () => {
        return (
            <Box
                sx={{                     
                    background: '#64447e',
                    boxSizing: 'border-box',
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                    ...(isSmallScreen && {p: '1rem' })                    
                }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List subheader={
                    <ListSubheader sx={{
                        bgcolor: 'inherit', 
                        // height: '100%',
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
                    <ListItemButton 
                        onClick={() => navigate('/chat', {
                            replace: true,
                        })}
                        sx={{
                            mt: '1rem'
                        }}                        
                        >
                        <ListItemIcon sx={{minWidth: '2rem'}}> 
                            <Home sx={{color: theme.palette.secondary.main, width: '1.2rem'}}/>
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Home'} 
                        />
                    </ListItemButton>
                    <ListItemButton >
                        <ListItemIcon sx={{minWidth: '2rem'}} >
                            <Person sx={{color: theme.palette.secondary.main, width: '1.2rem'}} />
                        </ListItemIcon>
                        <ListItemText 
                            sx={{color: 
                                theme.palette.secondary.main}}  
                                primary={'Profile'} 
                        />
                    </ListItemButton>
                    <MemoizedQueryList {...queryListProps}/>
                </List>
                <Button 
                    onClick={() => logout()}
                    size='small' 
                    sx={{ color: theme.palette.secondary.main, alignSelf: 'start' }} 
                    startIcon={<LogoutIcon/>}>
                    Logout
                </Button>
            </Box>  
            )
    };

    return (
        <Box sx={{
            overflow: 'hidden',
            position: 'relative',
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

export default SideBard;