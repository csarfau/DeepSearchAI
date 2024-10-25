import { Box, Button, CircularProgress, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from "react-router-dom";
import  { IQuerySideBar } from "../../hooks/useQuery"


export interface IQueryList {
    isLoading: boolean,
    queryList: Array<IQuerySideBar>,
    isEmpty: boolean
}

const QueryList:React.FC<IQueryList> = ({ queryList, isLoading, isEmpty }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    return (
        <Box sx={{ overflowY: 'hidden'}}>
            <ListItem
                
                sx={{ 
                    borderRadius: '8px',
                    paddingLeft: '0.2rem !important',  
                    '&:hover': {
                    backgroundColor: 'transparent',
                }}}                        
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
            {isLoading && isEmpty ? (
                <ListItem>
                    <CircularProgress size={24} />
                </ListItem>
            ) : queryList.length === 0 ? (
                <ListItem sx={{
                    px: 1,
                    py: 0,
                    borderLeft: '1px solid #bdbdbd'
                }}> 
                    <Typography variant="subtitle2" color={theme.palette.secondary.main}>No recent queries found</Typography>
                </ListItem>
                
            ) : (
                queryList.map((queryData, index) => (
                    index < 5 ? (
                        <ListItem key={index}
                            onClick={() => navigate(`/querie/${queryData.id}`, { state: { from: window.location.pathname } })}
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
                                    maxWidth: '11rem',
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
            )}
            </List>
        </Box>
    )
};

export default QueryList;