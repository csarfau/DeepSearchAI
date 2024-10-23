import { Box, Paper } from "@mui/material"
import { theme } from "../../App"
import { useUser } from "../../hooks/useUser"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import useToast from "../../hooks/useToast"
import { createApiClient } from "../../api/fetch"
import { Outlet } from "react-router-dom"

interface IQueries {
    id: string,
    query: string,
    create_at: string
    handleClick: () => void
}


const AuthenticatedLayout = () => {

    const showToast = useToast();
    const [queries, setQueries] = useState<Array<IQueries>>([]);
    const { isLoading: isUserLoading, user, token } = useUser();
    const [ isLoading, setIsLoading ] = useState(true);

    const getRecentQueries = async () => {

        if (!isUserLoading && user && token) {


            const apiClient = createApiClient({ token, userId: user.id });
            const response = await apiClient.getLatestQueries();
            
            if (response.error) return showToast(response.error);

            setQueries(response.data);
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        getRecentQueries();
    }, [isUserLoading]);

        
    return (
        <>
            <Box sx={{
                    width: '100%',
                    px: {
                        md: '1rem'
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
                <SideBar isLoading={isLoading} queryLIst={queries}/>
                <Paper elevation={2} sx={{
                    width: '100%',
                    height: { xs: '100%', md: '95%'},
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
                    <Outlet />
                </Paper>
            </Box>
        </>
    )
}

export default AuthenticatedLayout;