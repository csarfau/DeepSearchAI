import { IUserSearch, ISearchRepository } from "../types/search";
import { db } from "../database/knex";

export default class SearchRepository implements ISearchRepository {
  public async createSearch(
    search: IUserSearch
  ): Promise<Partial<IUserSearch>> {
    const newSearch = await db("user_searchs")
      .insert({
        user_id: search.user_id,
        query: search.query,
        result: search.result,
      })
      .returning("*");
    return newSearch[0];
  }

  public async getSearchById(id: string): Promise<IUserSearch | undefined> {
    const search = await db("user_searchs").select("*").where({ id }).first();

    return search;
  }

  public async getAllSearchsByUserId(
    user_id: string
  ): Promise<Array<IUserSearch>> {
    const searchs = await db("user_searchs")
      .select("id", "user_id", "query", "result")
      .where({ user_id })
      .orderBy("created_at", "desc");

    return searchs;
  }

  public async deleteSearchById(id: string): Promise<IUserSearch | undefined> {
    const deleted = await db("user_searchs")
      .where({ id })
      .delete()
      .returning("*");

    return deleted[0];
  }
}
