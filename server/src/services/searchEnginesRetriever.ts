import { ISearchResult } from "../types/searchEngine";
import { GoogleCustomSearchRetriever } from "../engines/googleCustomSearchRetriever";
import { TavilySearchRetriever } from "../engines/tavilySearchRetriever";

export default class SearchEnginesRetriever {
  private readonly customGoogleSearch: GoogleCustomSearchRetriever;
  private readonly tavilySearch: TavilySearchRetriever;

  constructor() {
    this.customGoogleSearch = new GoogleCustomSearchRetriever();
    this.tavilySearch = new TavilySearchRetriever();
  }

  public async searchAllEnginesResulst(
    query: string
  ): Promise<ISearchResult[]> {
    const [google, tavily] = await Promise.all([
      this.customGoogleSearch.retrieve(query),
      this.tavilySearch.retrieve(query)
    ]);

    return [...google, ...tavily];
  }
}
