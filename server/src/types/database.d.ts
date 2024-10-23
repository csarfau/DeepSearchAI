import { Knex } from "knex";

declare module "knex/types/tables" {

    interface User {
        id: string;
        email: string;
        name: string;
        password?: string;
        google_id?: string;
        created_at: Date;
        defined_theme: boolean
    }

    interface Theme {
        id: string; 
        name: string; 
    }
    
    interface UserTheme {
        id: string; 
        user_id: string; 
        theme_id: string; 
    }

    interface UserSearch{
        id: string,
        user_id: string,
        query: string,
        result: string,
        created_at: Date;
    }

    interface Tables {
        users: User;
        users_composite: Knex.CompositeTableType<
            User,
            Pick<User, "email" | "name"> & Partial<Pick<User, "created_at">>,
            Partial<Omit<User, "id">>
        >;

        themes: Theme;
        themes_composite: Knex.CompositeTableType<
            Theme,
            Pick<Theme, "name">,         
            Partial<Omit<Theme, "id">>   
        >;

        users_theme: UserTheme;
        users_theme_composite: Knex.CompositeTableType<
            UserTheme,
            Pick<UserTheme, "user_id" | "theme_id">, 
            Partial<Omit<UserTheme, "id">>          
        >;

        user_searchs: UserSearch;
        user_searchs_composite: Knex.CompositeTableType<
            UserSearch,
            Pick<UserSearch, "user_id" | "query" | "result"> & Partial<Pick<UserSearch, "created_at">>,
            never
        >;
    }
}
  