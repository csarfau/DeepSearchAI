import { Theme, UserTheme } from "knex/types/tables";

export interface IUser {
    id?: string,
    email: string,
    password: string
}

export interface ILoginTokenPayload {
    id: string;
    email: string;
}
declare module 'express-serve-static-core' {
        interface Request {
        user?: ILoginTokenPayload;
    }
}

export interface IUserRepository {
    createUser(userData: IUser): Promise<Partial<IUser> | undefined>;
    getUserByID(userID: string): Promise<Partial<IUser> | undefined>;
    getUserByEmail(userEmail: string): Promise<Partial<IUser> | undefined>;
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