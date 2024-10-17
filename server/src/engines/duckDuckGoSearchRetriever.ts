import { SearchResults } from "duck-duck-scrape";
import { ISearchResult } from "../types/searchEngine";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

export class DuckDuckGoSearchRetriever {
  private readonly retriever: DuckDuckGoSearch;

  constructor() {
    this.retriever = new DuckDuckGoSearch({ maxResults: 5 });
  }

  async retrieve(query: string): Promise<ISearchResult[]> {
    const response: SearchResults = JSON.parse(await this.retriever.invoke(query));


    return response.results.map((item) => ({
      url: item.url,
      snippet: item.rawDescription,
      title: item.title,
      source: "DuckDuckGoSearch",
    }));
  }
}
