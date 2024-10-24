import { Box, IconButton, Input, Typography } from "@mui/material";
import { theme } from "../../App";
import { Person } from '@mui/icons-material';
import { useUser } from "../../hooks/useUser";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { createApiClient } from "../../api/fetch";
import useToast from "../../hooks/useToast";
import { useEffect, useState } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';

interface IThemes {
    id: string,
    name: string
}

const ProfilePage = () => {
    const { user, token, isLoading: isLoadingUser } = useUser();
    const showToast = useToast();
    // const [ updateUser, setUpdateUser ] = useState<IUpdateUser>({newThemes: null})
    const [ themes, setThemes] = useState<Array<IThemes>>([]);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

    const getThemes = async () => {

        if (!isLoadingUser && token && user ) {
            const apiClient = createApiClient({token, userId: user.id });
            const response = await apiClient.getUsersTheme();
            if (response.error) return showToast(response.error, 'error');                           
            setThemes(response.data);
            
        }
    }

    useEffect(() => {
        getThemes();
    }, [isLoadingUser])

    return (
        <Box sx={{ minWidth: {md: '40rem'}, border: '1px solid #dadada', padding: '3rem 2rem 4rem', borderRadius: '0.5rem'}}>
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mb: '2rem'}}>
                <Person sx={{color: theme.palette.text.primary, width: '1.2rem', justifySelf: 'start'}} />
                <Typography 
                    variant="h5"
                    sx={{
                        color: theme.palette.text.primary
                    }}
                >
                    Profile
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                    height: '3rem',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid #dadada', 
                    borderBottom: '1px solid #dadada',
                    py: '1rem'
                }}>
                    <Box sx={{ display: 'flex', gap: '0.5rem'}}>
                        <MailOutlineIcon sx={{ width: '1rem'}}/>
                        <Typography>Email</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        {isUpdatingEmail ?
                            <Input placeholder="enter your new email ..." sx={{"::placeholder": {fontSize: '8px'}}}/>
                            :
                            <Typography variant="subtitle2" >{user?.email}</Typography>
                        }
                        <IconButton onClick={() => setIsUpdatingEmail(prev => !prev)}>
                            <EditNoteIcon/>
                        </IconButton>
                    </Box>
                </Box>                
                <Box sx={{
                    height: '3rem',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottom: '1px solid #dadada',
                    py: '1rem'
                }}>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <SettingsApplicationsOutlinedIcon sx={{ width: '1rem'}}/>  
                        <Typography >Suggestion Topics</Typography>   
                    </Box>                   
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        <Box sx={{ display: 'flex', gap: '1rem'}}>
                            {themes.map((theme, index) => (
                                <Typography  variant="subtitle2" key={index}>
                                    {theme.name}
                                </Typography>
                            ))

                            }
                        </Box>
                        <IconButton>
                            <EditNoteIcon/>
                        </IconButton>
                    </Box>

                </Box>
                <Box sx={{
                    height: '3rem',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderBottom: '1px solid #dadada',
                    py: '1rem'
                }}>
                    <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <PasswordOutlinedIcon sx={{ width: '1rem'}} />
                        <Typography>Password</Typography>
                    </Box>
                    <IconButton>
                        <EditNoteIcon/>
                    </IconButton>
                </Box>
            </Box>

        </Box>
    )
}

export default ProfilePage;