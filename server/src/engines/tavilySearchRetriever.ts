import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { config } from "dotenv";
import { ISearchResult } from "../types/searchEngine";

export class TavilySearchRetriever {
  private readonly retriever: TavilySearchAPIRetriever;

  constructor() {
    config();
    this.retriever = new TavilySearchAPIRetriever({
      apiKey: process.env.TAVILY_API_KEY,
      k: 10,
    });
  }

  async retrieve(query: string): Promise<ISearchResult[]> {
    const response = await this.retriever.invoke(query);

    return response.map((item) => ({
      url: item.metadata.source,
      snippet: item.pageContent,
      title: item.metadata.title,
      source: "tavily",
    }));
  }
}
