import { Box, Paper } from "@mui/material"
import { theme } from "../../App"
import { useUser } from "../../hooks/useUser"
import SideBar from "./SideBar"
import { useEffect, useState } from "react"
import useToast from "../../hooks/useToast"
import { createApiClient } from "../../api/fetch"
import { Outlet } from "react-router-dom"
import { IQuerySideBar, useQuery } from "../../hooks/useQuery"

interface ApiResponse {
    error?: string;
    data: Array<IQuerySideBar>;
}

const AuthenticatedLayout = () => {

    const showToast = useToast();
    const { isLoading: isUserLoading, user, token } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [isEmptyHistory, setIsEmptyHistory] = useState(false);
    const { queries, updateAllList } = useQuery();

    const getRecentQueries = async () => {
        if (!isUserLoading && user && token) {
            const apiClient = createApiClient({ token, userId: user.id });
            const response = await apiClient.getLatestQueries() as ApiResponse;
            
            if (response.error && !response.error.includes("504")) {
                showToast(response.error);
                return;
            }
            
            updateAllList(response.data);
            setIsEmptyHistory(response.data.length === 0);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRecentQueries();
    }, [isUserLoading, user, token]);
        
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
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#64447e',
                }}>
                <SideBar isLoading={isLoading} queryList={queries} isEmpty={isEmptyHistory}/>
                <Paper elevation={2} sx={{
                    width: '100%',
                    height: { xs: '100vh', md: '95vh'},
                    boxSizing: 'border-box',
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '2rem',
                    alignItems: {xs: 'start', sm: 'center'},
                    py: '2rem',
                    overflow: 'auto', 
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