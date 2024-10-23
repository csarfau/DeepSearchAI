import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

interface IUser {
    id: string;
    email: string;
    definedTheme?: boolean
}

interface IUserContext {
    user: IUser | null;
    token: string | null;
    setToken: (token: string | null) => void;
    logout: () => void;
    isLoading: boolean;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [token, setTokenState] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const setToken = useCallback((newToken: string | null) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
            try {
                const decodedUser = jwtDecode<IUser>(newToken);
                setUser(decodedUser);
                localStorage.setItem('user', JSON.stringify(decodedUser));
            } catch (error) {
                console.error('Failed to decode token', error);
                setUser(null);
                localStorage.removeItem('user');
            }
        } else {
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, []);

    const logout = useCallback(() => {
        setToken(null);
    }, [setToken]);

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('token');
            
            if (storedToken) {
                try {
                    const decodedUser = jwtDecode<IUser>(storedToken);
                    setUser(decodedUser);
                    setTokenState(storedToken);
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    return (
        <UserContext.Provider value={{ 
            user, 
            token, 
            setToken,
            logout,
            isLoading
        }}>
            { children }
        </UserContext.Provider> 
    );
};

export const useUser = (): IUserContext => {
    const context = useContext(UserContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }

    useEffect(() => {
        if (!context.isLoading && !context.token) {
            navigate('/');
        }
    }, [context.isLoading, context.token, navigate]);

    return context;
};