import { IUser, IUserRepository } from '../types/userTypes';
import { CustomError } from '../helpers/customError';
import { Knex } from 'knex';

export default class UserRepository implements IUserRepository {

    constructor(private readonly dbConnection: Knex) {}

    public async getUserByID(userID: string):Promise<Partial<IUser> | undefined > {

        const user = await this.dbConnection('users')
            .select('id', 'email')
            .where({id: userID})
            .first();
        
        return user
    }

}