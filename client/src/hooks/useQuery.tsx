import { createContext, ReactNode, useContext, useState } from 'react';

export interface IQuerySideBar {
    id: string;
    query: string;
    create_at: string;
    handleClick?: () => void;  
}

interface QueryContextType {
    queries: IQuerySideBar[];
    addQuery: (query: IQuerySideBar) => void;
    updateAllList: (query: Array<IQuerySideBar>) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [queries, setQueries] = useState<IQuerySideBar[]>([]);

    const addQuery = (query: IQuerySideBar) => {
        setQueries(prevQueries => {
            return [query, ...prevQueries].slice(0, 6);
        });
    };

    const updateAllList = (queryList: Array<IQuerySideBar>) => {
        setQueries(queryList);
    }

    return (
        <QueryContext.Provider value={{ 
            queries, 
            addQuery,
            updateAllList 
        }}>
            {children}
        </QueryContext.Provider>
    );
};

export const useQuery = () => {
    const context = useContext(QueryContext);
    if (!context) {
        throw new Error('useQuery must be used within a QueryProvider');
    }
    return context;
};