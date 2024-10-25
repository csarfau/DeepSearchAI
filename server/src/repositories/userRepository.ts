import { IUser, IUserRepository } from '../types/user';
import { db }  from '../database/knex';
import { IUserTheme, ITheme } from '../types/user';
import { CustomError } from '../helpers/customError';

export default class UserRepository implements IUserRepository {

    public async createUser(user: IUser): Promise<Partial<IUser>> {
        const newUser = await db('users')
            .insert({ email: user.email, password: user.password })
            .returning(['defined_theme', 'id', 'email']);
        return newUser[0];
    }
    
    public async createGoogleUser(user: IUser): Promise<Partial<IUser>> {
        const newUser = await db('users')
            .insert({ email: user.email, google_id: user.google_id })
            .returning(['id', 'email', 'defined_theme']);
        return newUser[0];
    }

    public async getUserByID(userID: string): Promise<Partial<IUser> | undefined > {
        const user = await db('users')
            .select('id', 'email')
            .where({ id: userID })
            .first();

        return user;
    }

    public async getUserByEmail(userEmail: string): Promise<Partial<IUser> | undefined > {
        const user = await db('users')
            .select('id', 'password', 'email', 'google_id', 'defined_theme')
            .where({email: userEmail})
            .first();

        return user;
    }

    public async updateUserById(user: IUser): Promise<Partial<IUser>> {
        const dataToUpdate:Partial<IUser> = {
            email: user.email
        }

        if(user.password) dataToUpdate.password = user.password;

        const updatedUser = await db('users')
            .where('id', user.id)
            .update(dataToUpdate)
            .returning(['id', 'email', 'defined_theme'])

        return updatedUser[0]
    }

    public async resetPassword(password: string, email: string): Promise<Partial<IUser> | undefined> {
        const user = await db('users')
            .where('email', email)
            .update({
                password
            })
            .returning('*');

        return user[0];
    }

    public async insertUsersTheme(userID: string, themesIDs:Array<string>):Promise<Array<IUserTheme>> {

        return await db.transaction(async trx => {
            try {
                const usersThemeData = themesIDs.map(themeID => ({
                    user_id: userID,
                    theme_id: themeID
                }));
    
                const [updateResult, insertResult] = await Promise.all([
                    trx('users')
                        .where({ id: userID })
                        .update('defined_theme', true),
                    
                    trx('users_theme')
                        .insert(usersThemeData)
                        .returning('*')
                ]);
    
                return insertResult;
            } catch (error) {
                throw new CustomError(500, 'Error in insert themes.');
            }
        });
    }

    public async updateUsersThemes(themes: IUserTheme[]):Promise<Array<IUserTheme>> {
        return await db.transaction(async trx => {
            const updatePromises = themes.map(theme => {

            return trx('users_theme')
                .where({ id: theme.id })
                .update({ theme_id: theme.theme_id })
                .returning('*');
            });
    
            const updatedResults = await Promise.all(updatePromises);
            
            return updatedResults.flat();
        });
    }

    public async getUserFullRegistreUserThemes(userId: string):Promise<Array<IUserTheme>>{
        return await db('users_theme')
            .select('id', 'user_id', 'theme_id')
            .where({user_id: userId})
    }

    public async getUsersThemes(userID: string): Promise<Array<string>> {

        const usersThemesIDs = await db('users_theme')
            .pluck('theme_id')
            .where('user_id', userID);
        
        const themesNames = await db('themes')
            .pluck('name')
            .whereIn('id', usersThemesIDs);

        return themesNames;
    }

    public async getThemes(): Promise<Array<ITheme>> {
        return await db('themes');
    }

    public async getUsersThemesById(userID: string): Promise<Array<ITheme>> {

        const usersThemesIDs = await db('users_theme')
            .pluck('theme_id')
            .where('user_id', userID);
        
        const themesNames = await db('themes')
            .select(['name', 'id'])
            .whereIn('id', usersThemesIDs);

        return themesNames;
    }
}