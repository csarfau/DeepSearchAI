import { ISearchResult } from "../types/searchEngine";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

export class DuckDuckGoSearchRetriever {
  private readonly retriever: DuckDuckGoSearch;

  constructor() {
    this.retriever = new DuckDuckGoSearch({ maxResults: 5 });
  }

  async retrieve(query: string): Promise<ISearchResult[]> {
    const response = JSON.parse(await this.retriever.invoke(query));

    return response.map((item: any) => ({
      url: item.link,
      snippet: item.snippet,
      title: item.title,
      source: "DuckDuckGoSearch",
    }));
  }
}
