
export interface IUserSearch {
    id?: string;
    user_id: string;
    query: string;
    result: string;
    created_at?: Date;
}

export interface IQueries{
    user_id: string;
    limit: number;
    offset: number;
    filterBy ?: string
}

export interface IQueriesPagination {
    searches: Array<IUserSearch>
    pageNumbers: number
}

export interface ISearchRepository {
    createSearch(searchData: IUserSearch): Promise<Partial<IUserSearch> | undefined>;
    getSearchById(id: string): Promise<IUserSearch | undefined>;
    getAllSearchsByUserId(data: IQueries): Promise<IQueriesPagination>;
    deleteSearchById(id: string): Promise<IUserSearch | undefined>;
}