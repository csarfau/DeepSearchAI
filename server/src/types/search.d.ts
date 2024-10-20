
export interface IUserSearch {
    id?: string;
    user_id: string;
    query: string;
    result: string;
    created_at?: Date;
}

export interface ISearchRepository {
    createSearch(searchData: IUserSearch): Promise<Partial<IUserSearch> | undefined>;
    getSearchById(id: string): Promise<IUserSearch | undefined>;
    getAllSearchsByUserId(user_id: string): Promise<Array<IUserSearch>>;
    deleteSearchById(id: string): Promise<IUserSearch | undefined>;
}