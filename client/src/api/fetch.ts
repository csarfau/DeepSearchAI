import { redirect } from "react-router-dom";

interface IFetchResponse {
    token?: string,
    data?: any,
    error?: string
}

const baseUrl = 'http://localhost:5000/api';

export interface ITheme {
    id: string,
    name: string
}

interface AuthOptions {
    token: string | null;
    userId: string | null;
}

const createAuthenticatedFetch = (authOptions: AuthOptions) => {

    return async (url: string, options: RequestInit = {}): Promise<IFetchResponse> => {

        if (!authOptions.token || !authOptions.userId) {
            redirect('/');
            return { error: 'Not authenticated' };
        }

        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${authOptions.token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                return { error: errorResponse.error };
            }

            const data = await response.json();
            return { ...data };
        } catch (error: any) {
            return { error: error.message };
        }
    };
};

export const createApiClient = (authOptions: AuthOptions) => {
    
    const authenticatedFetch = createAuthenticatedFetch(authOptions);

    return {
        fetchThemes: async (): Promise<IFetchResponse> => {
            return authenticatedFetch(baseUrl + '/themes');
        },

        saveUserThemes: async (usersThemes: Array<string>): Promise<IFetchResponse> => {
            return authenticatedFetch(baseUrl + `/user/${authOptions.userId}/themes`, {
                method: 'POST',
                body: JSON.stringify({ usersThemes }),
            });
        },

        login: async (email: string, password: string): Promise<IFetchResponse> => {
            try {
                const response = await fetch(`${baseUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    return { error: errorResponse.error };
                }

                const data = await response.json();
                return { ...data };
            } catch (error: any) {
                return { error: error.message };
            }
        },

        registerUser: async (email: string, password: string): Promise<IFetchResponse> => {
            try {
                const response = await fetch(`${baseUrl}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (!response.ok) {
                    const errorResponse = await response.json();
                    return { error: errorResponse.error };
                }

                const data = await response.json();
                return { ...data };
            } catch (error: any) {
                return { error: error.message };
            }
        },

        getPromptSuggestions: async (): Promise<IFetchResponse> => {
            return authenticatedFetch(baseUrl + `/user/${authOptions.userId}/suggestions`);
        },
    };
};
