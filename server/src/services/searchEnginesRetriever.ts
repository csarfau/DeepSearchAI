import { ISearchResult } from "../types/searchEngine";
import { GoogleCustomSearchRetriever } from "../engines/googleCustomSearchRetriever";
import { DuckDuckGoSearchRetriever } from "../engines/duckDuckGoSearchRetriever";

export default class SearchEnginesRetriever {
  private readonly customGoogleSearch: GoogleCustomSearchRetriever;
  private readonly duckDuckGoSearch: DuckDuckGoSearchRetriever;

  constructor() {
    this.customGoogleSearch = new GoogleCustomSearchRetriever();
    this.duckDuckGoSearch = new DuckDuckGoSearchRetriever();
  }

  public async searchAllEnginesResulst(
    query: string
  ): Promise<ISearchResult[]> {
    const [google, duckDuckGoSearch] = await Promise.all([
      this.customGoogleSearch.retrieve(query),
      this.duckDuckGoSearch.retrieve(query)
    ]);

    return [...google, ...duckDuckGoSearch];
  }
}
