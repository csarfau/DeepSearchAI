

interface IFetchResponse {
    data?: any,
    error?: string
}

const baseUrl = 'http://localhost:3000/api';

export interface ITheme {
    id: string,
    name: string
}

export const fetchThemes = async ():Promise<IFetchResponse> => {
    try {
        const response = await fetch(baseUrl + '/themes');

        if (!response.ok) {
            const errorResponse = await response.json();
            return { error: errorResponse.error }
        } 

        const data = await response.json();
        
        return { ...data };
    } catch (error: any) {
        return { error: error.message }
    }
}

export const saveUserThemes = async (userID: string, usersThemes:Array<string>):Promise<IFetchResponse> => {
    try {
        const response = await fetch(baseUrl + `/user/${userID}/themes`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({ 
                usersThemes
            }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return { error: errorResponse.error }
        } 

        const data = await response.json();
        
        return { ...data };
    } catch (error: any) {
        return { error: error.message }
    }
}