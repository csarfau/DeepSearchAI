import { ISearchResult } from "../types/searchEngine";
import { GoogleCustomSearchRetriever } from "../engines/googleCustomSearchRetriever";
import { DuckDuckGoSearchRetriever } from "../engines/duckDuckGoSearchRetriever";
import { TavilySearchRetriever } from "../engines/tavilySearchRetriever";

export default class SearchEnginesRetriever {
  private readonly customGoogleSearch: GoogleCustomSearchRetriever;
  // private readonly duckDuckGoSearch: DuckDuckGoSearchRetriever;
  private readonly tavilySearchRetriever: TavilySearchRetriever;

  constructor() {
    this.customGoogleSearch = new GoogleCustomSearchRetriever();
    this.tavilySearchRetriever = new TavilySearchRetriever();
    // this.duckDuckGoSearch = new DuckDuckGoSearchRetriever();
  }

  public async searchAllEnginesResulst(
    query: string
  ): Promise<ISearchResult[]> {
    const [google, tavily] = await Promise.all([
      this.customGoogleSearch.retrieve(query),
      this.tavilySearchRetriever.retrieve(query),
      // this.duckDuckGoSearch.retrieve(query)
    ]);

    return [...google, ...tavily];
  }
}
