import { Box, Button, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import { memo } from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from "react-router-dom";


interface IQueries {
    id: string,
    query: string,
    create_at: string
    handleClick: () => void
}

export interface IQueryList {
    isLoading: boolean,
    queryLIst: Array<IQueries>
}

const QueryList:React.FC<IQueryList> = ({queryLIst, isLoading}) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    
    return (
        <Box sx={{ overflowY: 'hidden'}}>
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
                <LibraryBooksIcon sx={{color: theme.palette.secondary.main, width: '1.2rem'}} />
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
                    padding: '0 0 0 1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box'

                }}
            >
            {isLoading ? (
                <ListItem>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2 }}>Loading queries...</Typography>
                </ListItem>
            ) : queryLIst.length > 0 ? (
                queryLIst.map((queryData, index) => (
                    index < 5 ? (
                        <ListItem key={index} 
                            onClick={() => navigate(`/querie/${queryData.id}`)}
                            sx={{ 
                                px: 1,
                                py: 0,
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                },
                                cursor: 'pointer',
                                borderLeft: '1px solid #bdbdbd',
                            }}
                        >
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
                    ) : (
                        <Button 
                            key={index}
                            onClick={() => navigate('/queries', {
                                replace: true
                            })}
                            variant='text' 
                            sx={{textTransform: 'none', 
                            color: theme.palette.secondary.main, alignSelf: 'end'}} 
                            endIcon={<ReadMoreIcon/>                                
                        }>
                            See All
                        </Button>
                    )
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

const MemoizedQueryList = memo(QueryList);

export default MemoizedQueryList;