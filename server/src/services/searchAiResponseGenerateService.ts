import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";
import { ISearchResult, IFilteredResultContent } from "../types/searchEngine";
import SearchEnginesRetriever from "./searchEnginesRetriever";
import TavilyContentExtractor from "./tavilyExtractContentService";

/**
 * Service class for generating AI responses based on user queries.
 *
 * This class handles the retrieval of search results, filtering,
 * content extraction, and interaction with AI models to produce
 * comprehensive search result reports.
 */
export default class SearchAiResponseGenerateService {
  private readonly searchEnginesRetriever: SearchEnginesRetriever;
  private llmInstance: ChatOpenAI;
  private llmInstanceStream: ChatOpenAI;

  /**
   * Initializes the service, setting up search engine retriever and AI model instances.
   */
  constructor() {
    this.searchEnginesRetriever = new SearchEnginesRetriever();
    this.llmInstance = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0,
      maxTokens: undefined,
      timeout: undefined,
      maxRetries: 2,
    });
    this.llmInstanceStream = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-4o-mini",
      temperature: 0,
      maxTokens: undefined,
      timeout: undefined,
      maxRetries: 2,
      streaming: true,
    });
  }

  /**
   * Generates an AI response based on the provided query.
   *
   * This asynchronous generator function retrieves search results, formats prompts,
   * calls an AI assistant, extracts relevant content, and streams the final response
   * in Markdown format. The function yields different types of progress updates during
   * its execution.
   *
   * @param {string} query - The query received from the user to generate the AI response. Should not be empty.
   *
   * @returns {AsyncGenerator<{ type: string; content: string }>} An asynchronous generator
   * that yields progress updates, including steps in the processing and the final AI content.
   *
   * @yields {{ type: "firstStep", content: string }} Indicates the end of the first step.
   * @yields {{ type: "secondStep", content: string }} Indicates the end of the second step.
   * @yields {{ type: "thirdStep", content: string }} Indicates the end of the third step.
   * @yields {{ type: "content", content: string }} Streams chunks of AI-generated content.
   * @yields {{ type: "done", content: string }} Indicates the completion of the process.
   *
   * @example
   * const responseGenerator = generateAiResponse("Best practices in AI.");
   * for await (const update of responseGenerator) {
   *   console.log(update);
   * }
   */
  public async *generateAiResponse(query: string) {
    try {
      const allSearchList =
        await this.searchEnginesRetriever.searchAllEnginesResulst(query);

      yield { type: "firstStep", content: "" };

      const filterPrompt = this.formatAiFilterPrompt(query, allSearchList);
      const filteredList: { urls: Array<string> } = await this.callAiAssistant(
        filterPrompt
      );
      yield { type: "secondStep", content: "" };

      const extractor = new TavilyContentExtractor(filteredList);
      const data = await extractor.extractAll();

      yield { type: "thirdStep", content: "" };

      const finalPrompt = this.formatAiUserRequestPrompt(query, data.results);

      const markdownSchema = z.object({
        response: z.string().describe("Content in Markdown format"),
      });

      const llmInstanceWithSchema =
        this.llmInstanceStream.withStructuredOutput(markdownSchema);

      const stream = await llmInstanceWithSchema.stream(finalPrompt);

      let lastChunk = "";
      for await (const chunk of stream) {
        if (typeof chunk.response !== "string") {
          continue;
        }
        
        yield {
          type: "content",
          content: chunk.response.slice(lastChunk.length),
        };
        lastChunk = chunk.response;
      }

      yield { type: "done", content: "" };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Generates an AI response using a dynamic validation scheme.
   * This function validates the output structure based on the provided schema.
   *
   * @param {Array<{ role: "user" | "assistant" | "system"; content: string }>} prompt - The prompt to be sent to the AI, structured as an array of message objects.
   * @returns {Promise<T>} The generated response from the AI, adhering to the defined output schema.
   *
   * @example
   * const response = await callAiAssistant([
   *   { role: "user", content: "What are the top 5 programming languages?" },
   *   { role: "system", content: "Provide a ranked list." }
   * ]);
   */
  private async callAiAssistant<T>(
    prompt: Array<{ role: "user" | "assistant" | "system"; content: string }>
  ): Promise<T> {
    const urlListSchema = z.object({
      urls: z
        .array(z.string().url())
        .min(1)
        .max(5)
        .describe("A list of the 5 most promising URLs"),
    });

    const llmInstanceWithSchema =
      this.llmInstance.withStructuredOutput(urlListSchema);

    const aiMsg = await llmInstanceWithSchema.invoke(prompt);

    return aiMsg as T;
  }

  /**
   * Formats a global prompt to send to OpenAI.
   * This function combines the user's query with search results to create a coherent prompt.
   *
   * @param {string} userQuery - The query received from the user.
   * @param {Array<Object>} engineResults - All results obtained from web search.
   * @returns {Array<{ role: "user" | "assistant" | "system"; content: string }>}
   * An array of message objects structured for the AI assistant.
   */
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
    
          Please evaluate the relevance and quality of these results, and select the 5 most useful URLs that best match the query intent. Your output should be a list of URLs in descending order of relevance, focusing on:
          1. Authoritative sources
          2. Clear and relevant information
          3. Unique insights or perspectives on the topic.
    
          Only return the URLs in the final output, with each URL on a new line.`,
      },
    ];
  }

  /**
   * Formats a prompt for the AI assistant based on user input and source content.
   *
   * This function constructs a detailed prompt that instructs the AI to generate
   * a comprehensive search result report based on the user's query and the contents
   * from multiple sources. The report will reference each piece of information by
   * corresponding source numbers.
   *
   * @param {string} userQuery - The query received from the user.
   * @param {IFilteredResultContent[]} urlContents - An array of filtered result contents,
   * containing the URLs and their corresponding raw content to be included in the report. Should not be empty.
   *
   * @returns {Array<{ role: "user" | "assistant" | "system"; content: string }>}
   * An array of message objects structured for the AI assistant, including the system role
   * and the user role with the formatted prompt.
   *
   * @example
   * const prompt = formatAiUserRequestPrompt("Best programming languages 2023", [
   *   { url: "https://example.com/1", rawContent: "JavaScript is widely used for web development." },
   *   { url: "https://example.com/2", rawContent: "Python is great for data science." }
   * ]);
   */
  private formatAiUserRequestPrompt(
    userQuery: string,
    urlContents: IFilteredResultContent[]
  ): Array<{ role: "user" | "assistant" | "system"; content: string }> {
    const contentTemplate = `
        Based on the following query: "${userQuery}" and the content from various sources listed below, write a detailed,
        informative, and helpful search result report about the topic.
    
        REMEMBER: FOR EACH PIECE OF INFORMATION, REFERENCE THE SOURCE BY THE CORRESPONDING NUMBER.
        MAKE SURE NOT TO MAKE UP OR USE INFORMATION YOU IMPLICITLY KNOW, INSTEAD ONLY GET INFORMATION FROM THE SOURCES.
        ALL INFORMATION IN THE REPORT MUST HAVE A REFERENCE TO THE SOURCE.
    
        Use multiple sources to complement the report. Provide the report in markdown format.
    
        Here is the content from the different sources:
    
        ${JSON.stringify(urlContents)}

        Ensure that each piece of information in the report is referenced by a number link references ex: e.g.,
        [1] (https://exemple.com).

        In the end have a references section where each numbered reference is followed by the corresponding URL, formatted naturally in markdown ex: ([3](https://www.example.org/careers/software-developer/))
        THIS STEP IS VERY IMPORTANT 
      `;

    let urlContentString = "";
    urlContents.forEach((result, index) => {
      urlContentString += `Source ${index + 1}: ${result.url}\n\n${
        result.rawContent
      }\n\n`;
    });

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
