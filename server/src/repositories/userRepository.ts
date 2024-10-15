import { IUser, IUserRepository } from '../types/user';
import { CustomError } from '../helpers/customError';
import { Knex } from 'knex';
import { IUserTheme, ITheme } from '../types/user';

export default class UserRepository implements IUserRepository {

    constructor(private readonly dbConnection: Knex) {}

    public async createUser(user: IUser): Promise<Partial<IUser>> {
        const newUser = await this.dbConnection('users').insert(user).returning('*');
        return newUser[0];
    }

    public async getUserByID(userID: string):Promise<Partial<IUser> | undefined > {

        const user = await this.dbConnection('users')
            .select('id', 'email')
            .where({id: userID})
            .first();
        
        return user
    }

    public async getUserByEmail(userEmail: string):Promise<Partial<IUser> | undefined > {

        const user = await this.dbConnection('users')
            .select('id', 'password', 'email')
            .where({email: userEmail})
            .first();
        
        return user
    }


    public async insertUsersTheme(userID: string, themesIDs:Array<string>):Promise<Array<IUserTheme>> {

        const usersThemeData = themesIDs.map(themeID => ({
            user_id: userID,
            theme_id: themeID
        }));

        return await this.dbConnection('users_theme').insert(usersThemeData).returning('*');
    }

    public async getUsersThemes(userID: string): Promise<Array<string>> {

        const usersThemesIDs = await this.dbConnection('users_theme')
            .pluck('theme_id')
            .where('user_id', userID);
        
        const themesNames = await this.dbConnection('themes')
            .pluck('name')
            .whereIn('id', usersThemesIDs);

        return themesNames;
    }

    public async getThemes(): Promise<Array<ITheme>> {
        return await this.dbConnection('themes');
    }

}