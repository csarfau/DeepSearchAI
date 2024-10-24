import { Box, Container, Paper, Typography, IconButton } from "@mui/material"
import { Send } from '@mui/icons-material'
import { theme } from "../../App"
import { useEffect, useState, useRef } from "react"
import { createApiClient } from "../../api/fetch"
import useToast from "../../hooks/useToast"
import { IUserSuggestion, SuggestionCard, SuggestionCardSkeleton } from "./partial/SuggestionCard"
import { useUser } from "../../hooks/useUser"
import QueryResponse from "./partial/QueryResponse"

const ChatPage = () => {
    const [promptSuggestions, setPromptSuggestion ] = useState<IUserSuggestion>();
    const [isAnsweringUsersQuery, setIsAnsweringUsersQuery] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [usersQuery ,setUsersQuery] = useState('');
    const {token, user, isLoading: isUserLoading } = useUser();

    const queryRef = useRef<HTMLTextAreaElement>(null);

    const showToast = useToast();
    useEffect(() => {
        const getPrompts = async () => {
            if (!isUserLoading && user && token) {
                
                const apiClient = createApiClient({ token, userId: user.id });
                const response = await apiClient.getPromptSuggestions();
    
                if(response.error) return showToast(response.error);

                setPromptSuggestion({
                    usersSuggestions: response.data,
                    setterPromptChoice: setUsersQuery,
                    setterTriggerResponse: setIsAnsweringUsersQuery
                });
                
                setIsLoading(false);
            }
        };

        getPrompts(); 
    }, [isUserLoading]);

    const handleUsersQuery = () => {
        if(!queryRef.current?.value) return
        setIsAnsweringUsersQuery(true);
        setUsersQuery(queryRef.current.value);
    }
        
    return (
        <>
            {!isAnsweringUsersQuery ? 
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
                        width: { xs: '100%', sm:'80%' },
                        alignSelf: 'center'
                    }}>
                        <textarea ref={queryRef} style={{ background: '#FFFFFF' }} placeholder="Search for anything ..."/>
                        <IconButton onClick={() => handleUsersQuery()} aria-label="send">
                            <Send sx={{ color: theme.palette.primary.main }}/>
                        </IconButton>
                    </Paper>
                    {isLoading ? (
                        <SuggestionCardSkeleton />
                    ) : (
                        promptSuggestions && <SuggestionCard { ...promptSuggestions } />
                    )}
                </Container>
            :
                <Box sx={{
                    width: '100%', 
                    height: '100%', 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch'
                }}>
                    {usersQuery &&
                        <QueryResponse query={ usersQuery } closeResponseAreaSetter={ setIsAnsweringUsersQuery }/>
                    }
                </Box>
            }
        </>
    )
}

export default ChatPage;