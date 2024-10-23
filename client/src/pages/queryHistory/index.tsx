import {  useEffect, useState } from "react";
import { createApiClient } from "../../api/fetch";
import { useUser } from "../../hooks/useUser";
import useToast from "../../hooks/useToast";
import { Box, IconButton,  Tooltip, Typography } from "@mui/material";
import { theme } from "../../App";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import TimeAgo from "./partial/TimeAgo";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import SearchInput from "./partial/SearchInput";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import NotFound from "../components/NotFound";

export interface IQueries {
    id?: string;
    user_id: string;
    query: string;
    result: string;
    created_at?: Date;
}

const QueryHistoryAll = () => {
    const { isLoading: isLoadingUser, token, user } = useUser();
    const [ allQueries, setAllQueries ] = useState<Array<IQueries>>([]);
    const [ isLoading, setIsloading] = useState(true);
    const [ offset, setOffset ] = useState(0);
    const [ pageNumbers, setPageNumbers ] = useState(1);
    const navigate = useNavigate();
    const showToast = useToast();
    const limit = 10;

    const getQueries = async (filterBy?:string) => {
        if (!isLoadingUser && token && user ) {
            const apiClient = createApiClient({token, userId: user.id })
            const response = await apiClient.getAllQueries(limit, offset, filterBy);
            if (response.error) return showToast(response.error, 'error');                           
            setPageNumbers(response.data.pageNumbers);
    
            filterBy ? setAllQueries(response.data.searches) : setAllQueries(prevQueries => [...prevQueries, ...response.data.searches]);
            setIsloading(false);
        }
    }

    const loadMoreQueries = () => {
        if (pageNumbers === 1 ) return;
        setOffset((prevOffset) => prevOffset + limit);
    };
    
    useEffect(() => {
        getQueries();
    }, [isLoadingUser, offset]);

    const removeMarkdown = (text:string) => {
        return text
            .replace(/^#+\s/gm, '') 
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/^\d+\.\s/gm, '')
            .replace(/^-\s/gm, '')
            .replace(/^>\s/gm, '')
            .trim();
    }

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100%', 
            overflow: 'auto', 
            boxSizing: 'border-box',
            position: 'relative',
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
            
        }}>            
            <Box sx={{
                display: 'flex',  
                width: '100%',                
                maxWidth: '50rem',  
                margin: '0 auto ',
                justifyContent: 'space-between',
                alignItems: 'start',
                }}>
                <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <LibraryBooksIcon sx={{color: theme.palette.text.primary, width: '1.2rem', justifySelf: 'start'}} />
                    <Typography 
                        variant="h5"
                        sx={{
                            color: theme.palette.text.primary
                        }}
                    >
                        Query History
                    </Typography>
                </Box>
                <SearchInput onSearch={getQueries} placeholder="Search your queries ..."/>
            </Box>
                {
                !isLoading ? 
                    allQueries?.map((query, index) => (
                        <Box 
                            sx={{ 
                                maxWidth: '50rem',  
                                margin: index === 0 ? '4rem auto 0' : '0 auto',
                                overflowY: 'hidden',                                  
                                padding: { xs: '1rem 1rem', md: '1rem 0' },
                                borderBottom: `1px solid ${theme.palette.text.secondary}`  
                            }} 
                            key={index}
                        >
                            <Typography 
                                variant="subtitle1" 
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    color: theme.palette.text.primary,
                                    fontWeight: 'bold',
                                }}
                            >
                                {query.query}
                            </Typography>
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {removeMarkdown(query.result)}
                            </Typography>
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    pt: '0.2rem',
                                }}
                            >
                                <TimeAgo createdAt={String(query.created_at)} />
                                <Tooltip title="See more" sx={{ padding: '0' }}>
                                    <IconButton onClick={() => navigate(`/querie/${query.id}`, { state: { from: window.location.pathname } })}>
                                        <OpenInNewIcon 
                                            sx={{
                                                width: '1.2rem', 
                                                height: '1.2rem', 
                                                color: theme.palette.primary.main,
                                            }} 
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    ))
                 : 
                    <CircularProgress sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%)'
                    }}/>
                
            }
            {allQueries.length === 0 &&
                <NotFound message="We couldn't find any items that match your filter."/>
            }

            {pageNumbers > 1 && (
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        alignItems: 'end',
                        mt: '2rem',
                    }}
                >
                    <Tooltip title="Load more">
                        <IconButton  
                            onClick={loadMoreQueries}
                            sx={{
                                '&.Mui-disabled': { 
                                    opacity: 0.5, 
                                    color: 'gray',
                                },
                            }}
                        >
                            <ArrowDropDownCircleIcon sx={{ color: '#64447e' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    )
}

export default QueryHistoryAll;