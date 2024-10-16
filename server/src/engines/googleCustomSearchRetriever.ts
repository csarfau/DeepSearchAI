import { google } from "googleapis";
import { config } from "dotenv";
import { ISearchResult } from "../types/searchEngine";

export class GoogleCustomSearchRetriever {
  private readonly googleCSE;
  private readonly params;

  constructor() {
    config();
    this.googleCSE = google.customsearch("v1");
    this.params = {
      cx: process.env.GOOGLE_CX_ID,
      auth: process.env.GOOGLE_API_KEY,
      num: 10,
    };
  }

  public async retrieve(query: string): Promise<ISearchResult[]> {
    const response = await this.googleCSE.cse.list({
      ...this.params,
      q: query,
    });

    const data: ISearchResult[] = (response.data.items || []).map((item) => ({
      title: item.title || "",
      snippet: item.snippet || "",
      url: item.link || "",
      source: "google",
    }));

    return data || [];
  }
}
