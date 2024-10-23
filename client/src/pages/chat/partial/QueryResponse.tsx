import React, { useState, useCallback, useEffect, useRef, ComponentPropsWithoutRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Box, Button, Theme } from '@mui/material';
import { createApiClient, ResponseStreamType } from '../../../api/fetch';
import { useUser } from '../../../hooks/useUser';
import StepperContainer from './StepperContainer';
import ErrorAlert from './ErrorAlert';

declare module "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus" {
    const style: { [key: string]: React.CSSProperties };
}

interface EnhancedQueryResponseProps {
    query: string;
    closeResponseAreaSetter: React.Dispatch<React.SetStateAction<boolean>>;
}

const EnhancedQueryResponse: React.FC<EnhancedQueryResponseProps> = ({ query, closeResponseAreaSetter }) => {

    const [searchResults, setSearchResults] = useState<{
            type: ResponseStreamType;
            content: string;
            message?: string
        }>({
            type: 'init',
            content: ''
        });
    
    const [currentStep, setCurrentStep] = useState<ResponseStreamType>('init');
    const [responseError, setResponseError] = useState('');

    const { token, user, isLoading: isUserLoading } = useUser();
    const scrollBoxRef = useRef<HTMLDivElement>(null);

    const handleSearch = useCallback(async () => {
        if (!isUserLoading && user && token) {
            const apiClient = createApiClient({
                token,
                userId: user?.id
            });

            
        setSearchResults({
            type: 'firstStep',
            content: ''
        });
    
        try {
            await apiClient.streamingSearch(query, (response) => {
            setSearchResults(prev => ({
                type: response.type,
                content: prev.content + (response.content || '')
            }));
            
            if (response.type === 'error') setResponseError(response.message as string)
            if (response.type !== 'content') setCurrentStep(response.type);
            
        });
        
        }
    }, [query, isUserLoading, user, token]);

    useEffect(() => {
        handleSearch();
    }, []);

    return (
        <>
        {searchResults.type === 'content' || searchResults.type === 'done' || searchResults.type === 'store' ?
            (    <Box
                    ref={scrollBoxRef}
                    sx={{
                        width: '100%',
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        backgroundColor: (theme: Theme) => theme.palette.secondary.main,
                        color: (theme: Theme) => theme.palette.text.primary,
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        padding: '1rem',
                        "& h1": {
                            fontSize: '1.5rem',
                            textAlign: 'center'
                        },
                        "& h2": {
                            fontSize: '1.3rem'
                        },
                        "& h3": {
                            fontSize: '1.1rem'
                        },

                        "& a": {
                            fontSize: '1rem',
                            color: (theme: Theme) => theme.palette.primary.main,
                            position: 'relative',
                            fontWeight: 'bold',
                            marginRight: '1.3rem',
                            maxWidth: '30rem',
                            '-webkit-box-orient': 'vertical',
                            '-webkit-line-clamp': 1,
                            textOverflow: 'ellipsis'
                            
                        },
                        "& a::after": {
                            position: 'absolute',
                            right: '-1.1rem',
                            top: 0,
                            content: "''", 
                            width: '0.8rem',
                            height: '0.8rem',
                            backgroundImage: "url('/src/assets/icons/link-icon.svg')",
                            backgroundSize: 'contain', 
                            backgroundRepeat: 'no-repeat', 
                            backgroundPosition: 'center' 
                        },
                        '&::-webkit-scrollbar': {
                            width: '0.4rem'
                        },
                        '&::-webkit-scrollbar-track': {
                            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                            webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'rgb(108, 87, 117)',
                            outline: '1px solid slategrey'
                        }
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: '50rem',  
                            margin: '0 auto'  
                        }}
                    >
                        {searchResults.type === 'store' &&
                            <Button variant='text' onClick={() => {
                                closeResponseAreaSetter(false);
                            }}>
                                New query
                            </Button>
                        }
                        <ReactMarkdown
                            components={{
                                code: ({ inline, className, children, ...props }: ComponentPropsWithoutRef<'code'> & { inline?: boolean }) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus as any}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                a: ({node, id, ...props}) => (
                                    <a target="_blank" rel="noopener noreferrer" {...props} />
                                )
                            }}
                        >
                            { searchResults.content }
                        </ReactMarkdown>
                        {searchResults.type === 'store' &&
                            <Button variant='text' onClick={() => closeResponseAreaSetter(false)}>New query</Button>

                        }
                    </Box>
                </Box>

            )
            :
            (
                <>
                    {!responseError  &&
                        <StepperContainer currentStep={currentStep} />
                    }
                    {responseError && (
                        <ErrorAlert
                            closeResponseAreaSetter={closeResponseAreaSetter}
                            message={responseError}
                        />
                    )}
                </>
            )}
        
        </>
    );
};

export default EnhancedQueryResponse;
