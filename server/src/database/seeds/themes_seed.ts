import { Knex } from "knex";

export async function seed(knex: Knex) {
    await knex("themes").del();

    await knex("themes").insert([
        { name: "trip" },
        { name: "programming" },
        { name: "cooking" },
        { name: "art" },
        { name: "politics" },
        { name: "sport" },
        { name: "history" },
        { name: "music" },
        { name: "technology" },
    ]);
};
