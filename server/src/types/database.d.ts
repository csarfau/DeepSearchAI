import { Knex } from "knex";

declare module "knex/types/tables" {
    interface User {
        id: string;
        email: string;
        name: string;
        created_at: Date;
    }
  
    interface Tables {
        users: User;
        users_composite: Knex.CompositeTableType<
            User,
            Pick<User, "email" | "name"> & Partial<Pick<User, "created_at">>,
            Partial<Omit<User, "id">>
        >;
    }
  }
  