import { Box, Container, Paper, Typography, IconButton } from "@mui/material"
import { Send } from '@mui/icons-material'
import { theme } from "../../App"
import ResponsiveDrawer, { IUserSuggestion, SuggestionCard } from "./partial"
import { useEffect, useState } from "react"
import { getPromptSuggestions } from "../../api/fetch"
import useToast from "../../hooks/useToast"

const ChatPage = () => {
    const [promptSuggestions, setPromptSuggestion ] = useState<IUserSuggestion>({});

    const showToast = useToast();
    useEffect(() => {
        const getPrompts = async () => {
            const { data, error } = await getPromptSuggestions('45015b5e-0862-4942-a823-17aa20514b99');     
            // setLoading(false);
            data ? setPromptSuggestion(data) : showToast(error as string, 'error');
        };

        getPrompts(); 
    }, []);
        
    return (
        <>
            <Box sx={{
                    width: '100%',
                    px: {
                        xs: '5px',
                        lg: '1rem'
                    },
                    gap: {
                        lg: '1rem'
                    },
                    boxSizing: 'border-box',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#64447e',
                }}>
                <ResponsiveDrawer />
                <Paper elevation={2} sx={{
                    width: '100%',
                    minHeight: '95vh',
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '2rem',
                    alignItems: 'center',
                    py: '2rem',
                    backgroundColor: theme.palette.secondary.main,
                    border: theme.borders.secondary
                }}>
                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '1rem',
                                textAlign: 'center'
                            }} 
                        >
                            <img style={{width: '3rem'}} src="/src/assets/images/logo.svg" alt="logo icon"/>
                            <Typography variant="h5"
                                sx={{
                                    maxWidth: '28rem',
                                    background: (theme) => theme.palette.gradients.text,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    WebkitTextFillColor: 'transparent',
                                }}              
                            >
                                Enter your query below to get AI-powered insights and references.
                            </Typography>
                            <img style={{width: '1.2rem'}} src="/src/assets/icons/arrow-down-icon.svg" alt="arrow icon" />
                        </Box>
                        <Paper elevation={1} sx={{
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'end',
                            padding: '0.5rem',
                            width: {xs: '100%', sm:'80%'},
                            alignSelf: 'center'
                        }}>
                            <textarea placeholder="Search for anything ..."/>
                            <IconButton  aria-label="send">
                                <Send sx={{ color: theme.palette.primary.main }}/>
                            </IconButton>
                        </Paper>
                        {promptSuggestions &&
                            <SuggestionCard { ...promptSuggestions } />
                        }
                    </Container>
                </Paper>
            </Box>
        </>
    )
}

export default ChatPage;