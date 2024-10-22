import { IUserSearch, ISearchRepository, IQueries, IQueriesPagination } from "../types/search";
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
      .returning(['id', 'query']);
    return newSearch[0];
  }

  public async getSearchById(id: string): Promise<IUserSearch | undefined> {
    const search = await db("user_searchs").select("*").where({ id }).first();

    return search;
  }

  public async getAllSearchsByUserId(
    data: IQueries
  ): Promise<IQueriesPagination> {

    const { user_id, limit, offset, filterBy } = data;
    
    let query = db("user_searchs")
      .where({ user_id })
      .orderBy("created_at", "desc")
    
    if (filterBy !== undefined) {
      query = query.where(builder => {
        builder.where('query', 'like', `%${filterBy}%`)
          .orWhere('result', 'like', `%${filterBy}%`);
      });
    }
      
    const pageNumbers = Math.ceil((await query).length / Number(limit));

    let dynamicOffset = offset
    if(filterBy) dynamicOffset = 0;
    
    query
      .limit(limit)
      .offset(dynamicOffset);
        
    const searches = await query;
    
    return {
      searches,
      pageNumbers
    };
  }

  public async deleteSearchById(id: string): Promise<IUserSearch | undefined> {
    const deleted = await db("user_searchs")
      .where({ id })
      .delete()
      .returning("*");

    return deleted[0];
  }

  public async getLatestQueries(user_id: string): Promise<Array<Partial<IUserSearch>>> {
    const searchs = await db("user_searchs")
      .select("id", "query", "created_at")
      .where({ user_id })
      .orderBy("created_at", "desc")
      .limit(6);

    return searchs;
  } 
}
