import { Theme, UserTheme } from "knex/types/tables";

export interface IUser {
    id?: string,
    name: string,
    email: string,
    password: string
}

export interface IUserRepository {
    login(credentials: Partial<IUser>): Promise<string | undefined>;
    createUser(userData: IUser): Promise<Partial<IUser> | undefined>;
    getUserByID(userID: string): Promise<Partial<IUser> | undefined>;
    insertUsersTheme(userID: string, themesIDs:Array<string>):Promise<Array<UserTheme>>
    getUsersThemes(userID: string): Promise<Array<string>>
    getThemes(): Promise<Array<Theme>>
}

export interface IUserTheme {
    id: string,
    user_id: string,
    theme_id: string
}

export interface ITheme {
    id: string,
    name: string
}