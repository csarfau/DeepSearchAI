import { Box, IconButton, Input, Typography, Button } from "@mui/material";
import { theme } from "../../App";
import { Person, Visibility, VisibilityOff } from '@mui/icons-material';
import { useUser } from "../../hooks/useUser";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { createApiClient } from "../../api/fetch";
import useToast from "../../hooks/useToast";
import {  useState } from "react";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';

const ProfilePage = () => {
    const { user, token, setToken } = useUser();
    const showToast = useToast();

    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleClickShowRegisterPassword = () => setShowRegisterPassword((show) => !show);

    const handleSubmit = async () => {

        if (token && user) {
            const clientApi = createApiClient({token, userId: user.id})
            
            const response = await clientApi.updateUser({
                ...(newPassword && { password: newPassword }),
                email: newEmail || user.email
            })

            if (response.error) {
                showToast(response.error, 'error');
                return
            }

            showToast('Successful update');
            setToken(response.data);
        }

        setIsUpdatingEmail(false);
        setIsUpdatingPass(false);
        setNewPassword('');
    };

    const resetFields = () => {
        setIsUpdatingEmail(false);
        setIsUpdatingPass(false);
        setNewEmail('');
        setNewPassword('');
    };

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
            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <Box sx={{
                    minHeight: '3rem',
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        {isUpdatingEmail ? (
                            <Input 
                                placeholder="enter your new email ..." 
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                sx={{"::placeholder": {fontSize: '8px'}}}
                            />
                        ) : (
                            <Typography variant="subtitle2">{user?.email}</Typography>
                        )}
                        <IconButton onClick={() => setIsUpdatingEmail(prev => !prev)}>
                            <EditNoteIcon/>
                        </IconButton>
                    </Box>
                </Box>
                <Box sx={{
                    minHeight: '3rem',
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        {isUpdatingPass ? (
                            <>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowRegisterPassword}
                                    edge="end"
                                >
                                    {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                <Input  
                                    type={showRegisterPassword ? 'text' : 'password'} 
                                    placeholder="enter your new password ..." 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    sx={{"::placeholder": {fontSize: '8px'}}}
                                />
                            </>
                        ) : (
                            <Typography variant="subtitle2">********</Typography>
                        )}
                        <IconButton onClick={() => setIsUpdatingPass(prev => !prev)}>
                            <EditNoteIcon/>
                        </IconButton>
                    </Box>
                </Box>
                {(newEmail || newPassword) && (
                    <Box sx={{ 
                        position: 'absolute',
                        bottom: '-3rem', 
                        display: 'flex', 
                        gap: '1rem', 
                        justifyContent: 'flex-end',
                        mt: '1rem'
                    }}>
                        <Button 
                            variant="outlined" 
                            color="error"
                            onClick={resetFields}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            onClick={() => handleSubmit()}
                        >
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ProfilePage;