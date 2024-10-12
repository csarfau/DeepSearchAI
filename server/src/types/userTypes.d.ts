
export interface IUser {
    id?: string,
    email: string,
    password: string
}

export interface IUserRepository {
    getUserByID(userID: string): Promise<Partial<IUser> | undefined>;
}