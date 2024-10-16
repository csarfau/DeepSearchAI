import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ISearchResult, IFilteredResultContent } from "../types/searchEngine";
import SearchEnginesRetriever from "./searchEnginesRetriever";
import TavilyContentExtractor from "./tavilyExtractContentService";

export default class SearchAiResponseGenerateService {
  private llmInstance;
  private urlListSchema = z.object({
    urls: z
      .array(z.string().url())
      .min(1)
      .max(10)
      .describe("A list of the 10 most promising URLs"),
  });
  private markdownSchema = z.object({
    response: z.string().describe("Content in Markdown format"),
  });

  private readonly searchEnginesRetriever: SearchEnginesRetriever;

  constructor() {
    this.searchEnginesRetriever = new SearchEnginesRetriever();
    this.llmInstance = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0,
      maxTokens: undefined,
      timeout: undefined,
      maxRetries: 2,
      streaming: true
    });
  }


  public async generateAiResponse<T>(query: string): Promise<T> {
    try {
      const allSearchList =
        await this.searchEnginesRetriever.searchAllEnginesResulst(query);

      const filterPrompt = this.formatAiFilterPrompt(query, allSearchList);
      const filteredList: { urls: Array<string> } = await this.callAiAssistant(
        filterPrompt,
        this.urlListSchema
      );

      const extractor = new TavilyContentExtractor(filteredList);
      const data = await extractor.extractAll();

      const finalPrompt = this.formatAiUserRequestPrompt(query, data.results);
      // return finalPrompt as T

      const finalReport: { response: string } = await this.callAiAssistant(
        finalPrompt,
        this.markdownSchema
      );

      console.log(finalReport.response);

      return finalReport.response as T;
    } catch (error) {
      console.log("Error:: ", error);
      return `${error}` as T;
    }
  }

  /**
   * Generate AI response with a dinamic validation scheme
   * @param prompt - Prompt to be send to the AI
   * @param schema - Validation scheme (`markdownSchema` or `urlArraySchema`)
   */
  private async callAiAssistant<T>(
    prompt: Array<{ role: "user" | "assistant" | "system"; content: string }>,
    schema: z.ZodType
  ): Promise<T> {
    const llmInstanceWithSchema = this.llmInstance.withStructuredOutput(schema);

    const aiMsg = await llmInstanceWithSchema.invoke(prompt);

    return aiMsg as T;
  }

  private formatAiFilterPrompt(
    userQuery: string,
    engineResults: ISearchResult[]
  ): Array<{ role: "user" | "assistant" | "system"; content: string }> {
    return [
      {
        role: "system",
        content:
          "You are an AI assistant specialized in evaluating and filtering search engine results to provide the most relevant information for a given query.",
      },
      {
        role: "user",
        content: `I have gathered search results from multiple platforms for the following query: "${userQuery}". Below is a combined list of these search results, with each entry including a title, snippet, and URL:
    
          ${engineResults
            .map(
              (result) =>
                `Title: ${result.title}\nDescription: ${result.snippet}\nURL: ${result.url}`
            )
            .join("\n\n")}
    
          Please evaluate the relevance and quality of these results, and select the 10 most useful URLs that best match the query intent. Your output should be a list of URLs in descending order of relevance, focusing on:
          1. Authoritative sources
          2. Clear and relevant information
          3. Unique insights or perspectives on the topic.
    
          Only return the URLs in the final output, with each URL on a new line.`,
      },
    ];
  }

  private formatAiUserRequestPrompt(
    userQuery: string,
    urlContents: IFilteredResultContent[]
  ): Array<{ role: "user" | "assistant" | "system"; content: string }> {
    const contentTemplate = `
        Based on the following query: "${userQuery}" and the content from various sources listed below, write a detailed,
        informative, and helpful search result report about the topic.
    
        Ensure that each piece of information in the report is referenced by a number in brackets (e.g., [1], [2], etc.), and at the end of the report, include a references list with the corresponding URLs (in the format [1]: <URL>, [2]: <URL>, etc.).
    
        Do not call it a "report", but a "search result" and write it as such.
    
        REMEMBER: FOR EACH PIECE OF INFORMATION, REFERENCE THE SOURCE BY THE CORRESPONDING NUMBER.
        MAKE SURE NOT TO MAKE UP OR USE INFORMATION YOU IMPLICITLY KNOW, INSTEAD ONLY GET INFORMATION FROM THE SOURCES.
        ALL INFORMATION IN THE REPORT MUST HAVE A REFERENCE TO THE SOURCE.
    
        Use multiple sources to complement the report. Provide the report in markdown format.
    
        Here is the content from the different sources:
    
        ${JSON.stringify(urlContents)}
      `;

    let urlContentString = "";
    urlContents.forEach((result, index) => {
      urlContentString += `Source ${index + 1}: ${result.url}\n\n${
        result.rawContent
      }\n\n`;
    });

    // Return the formatted message to be sent to the AI
    return [
      {
        role: "system",
        content:
          "You are an AI assistant that writes detailed and informative search result reports based on provided data.",
      },
      {
        role: "user",
        content: contentTemplate.replace("{url_contents}", urlContentString),
      },
    ];
  }

}
