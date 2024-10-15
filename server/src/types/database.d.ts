import { Knex } from "knex";

declare module "knex/types/tables" {

    interface User {
        id: string;
        email: string;
        name: string;
        password?: string;
        created_at: Date;
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
    }
}
  