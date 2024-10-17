import { Request, Response } from 'express';
import SuggestionGenerationService from '../services/suggestionGenerationService';
import UserRepository from '../repositories/userRepository';
import { IUser, IUserRepository } from '../types/user';
import bcrypt, { compare } from 'bcrypt';
import { createToken } from '../utils/token';

import { config } from 'dotenv';
import { ChatOpenAI }  from "@langchain/openai";
import { TavilySearchResults }  from "@langchain/community/tools/tavily_search";
import { GoogleCustomSearch }  from "@langchain/community/tools/google_custom_search";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { google } from "googleapis";
import { PromptTemplate } from "@langchain/core/prompts";
import llm from '../openIA/chatOpenIA';

config();

const customsearch = google.customsearch("v1");

const googleApiKey = process.env.GOOGLE_API_KEY;
const cseId = process.env.GOOGLE_CX_ID;

const tavily = new TavilySearchResults({
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 5,
    kwargs: { 
        include_images: false, 
        search_depth: "basic", 
        include_raw_content: false
    }
});
  
//   const google = new GoogleCustomSearch({
//     apiKey: process.env.GOOGLE_API_KEY,
//     googleCSEId: process.env.GOOGLE_CSE_ID,
//   });
  
//   const duckDuckGo = new DuckDuckGoSearchResults({
//     maxResults: 3,
//   });
  
//   const model = new ChatOpenAI({
//     modelName: "gpt-3.5-turbo",
//     streaming: true,
//   });
  
//   async function searchAndStream(query) {
//     console.log("Searching...");
//     const [tavilyResults, googleResults, duckDuckGoResults] = await Promise.all([
//       tavily.call(query),
//       google.call(query),
//       duckDuckGo.call(query),
//     ]);
  
//     const allResults = [
//       ...JSON.parse(tavilyResults).map(r => ({ url: r.url, snippet: r.snippet })),
//       ...JSON.parse(googleResults).map(r => ({ url: r.link, snippet: r.snippet })),
//       ...duckDuckGoResults.map(r => ({ url: r.link, snippet: r.snippet })),
//     ];
  
//     console.log("Search complete. Analyzing results...");
  
//     const prompt = `
//     You are an AI assistant tasked with analyzing search results and identifying the most relevant ones.
//     Here are the search results for the query: "${query}"
    
//     ${JSON.stringify(allResults, null, 2)}
    
//     Please analyze these results and identify the 10 most relevant pages that can best answer the query.
//     For each selected result, provide:
//     1. The URL
//     2. A brief explanation of why you think this result is relevant
    
//     Format your response as a JSON array of objects, each containing 'url' and 'reason' properties.
//     `;
  
//     const stream = await model.stream(prompt);
  
//     console.log("Streaming analysis...");
//     let analysisResult = '';
//     for await (const chunk of stream) {
//       process.stdout.write(chunk.content);
//       analysisResult += chunk.content;
//     }
//     console.log("\nAnalysis complete.");
  
//     return JSON.parse(analysisResult);
//   }
  
//   // Example usage
//   searchAndStream("What are the latest developments in quantum computing?")
//     .then(result => console.log("\nFinal result:", JSON.stringify(result, null, 2)))
//     .catch(error => console.error("Error:", error));

const userRepository = new UserRepository(); 
const suggestionService = new SuggestionGenerationService();

export default class UserController {

    public async createUser(req: Request, res: Response) {
        const { email, password } = req.body;

        const user: IUser = {
            email,
            password: await bcrypt.hash(password, 10)
        }

        return res.status(201).json({
            data: await userRepository.createUser(user)
        });
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await userRepository.getUserByEmail(email);
        if(!user) {
            return "Credentials not found."
        }

        const comparePassword = await compare(password as string, user.password as string);
        if(!comparePassword) {
            return "Credentials not found.";
        }

        const token = createToken({ id: user.id as string, email }, { expiresIn: "1d" });

        return res.status(200).json({token});
    } 

    public async saveThemeSuggestions(req: Request, res: Response) {
        return res.status(201).json({
            data: await userRepository.insertUsersTheme(req.params.id, req.body.usersThemes)
        })
    }

    public async getUsersSuggestions(req: Request, res: Response) {
        const themesNames = await userRepository.getUsersThemes(req.params.id);
        const suggestions = await suggestionService.generatePrompt(themesNames, 6);
        return res.status(200).json({
            data: suggestions 
        })
    }

    public async getThemes(req: Request, res: Response) {
        console.log(req);
        
        const themes = await userRepository.getThemes();
        return res.status(200).json({
            data: themes
        })
    }

    public async getUsersPagesSuggetions(req: Request, res:Response) {

        const themesNames= await userRepository.getUsersThemes(req.params.id);
        const pageData= await suggestionService.generatePagesSuggestions(themesNames);
    
        const pageDataWithType = pageData.map((data, index) => ({    
            type: themesNames[index],
            pageData: data       
        }))

        return res.status(200).json({ 
            data: pageDataWithType 
        });
    }

    public async getUsersQuery(req: Request, res: Response) {

        const query = 'How cook lasanha';

        // const [tavilySearch, googleSearch] = await Promise.all([
        //     tavily.invoke(query),
        //     customsearch.cse.list({
        //         cx: cseId,
        //         q: query,
        //         auth: googleApiKey,
        //         num: 5,
        //         safe: 'active',
        //         fields: 'items(link,snippet)',
        //     }),
        // ]);
        

        // const combinedResults = [
        //     ...JSON.parse(tavilySearch),
        //     ...(googleSearch.data?.items || []).map(r => ({
        //         snippet: r.snippet || '',
        //         link: r.link || ''
        //     })),
        // ];

        // const formattedResults = combinedResults.map((result, index) => {
        //     const url = result.url || result.link || 'No URL';
        //     const content = result.content || result.snippet || 'No content';
        //         return `Result ${index + 1}:
        //         URL: ${url}
        //         Content: ${content}
        // `;});

        const tool = new DuckDuckGoSearch({ maxResults: 5 });
        const duckDuckGoSearch = tool.invoke("how to learn laravel?");
  
        const [duckDuckGoResults, googleResults] = await Promise.all([
            duckDuckGoSearch,
            customsearch.cse.list({
                cx: cseId,
                q: "how to learn laravel?",
                auth: googleApiKey,
                num: 5,
                safe: 'active',
                fields: 'items(link,snippet,title)',
            }),
        ]);
        console.log(duckDuckGoResults, googleResults.data.items);
        
        // const combinedResults = [
        //     ...(JSON.parse(duckDuckGoResults)),
        //     ...(googleResults.data?.items || []).map(r => ({
        //         url: r.link || 'No URL',
        //         content: r.snippet || 'No content'
        //     })),
        // ];

        // const result = await llm.invoke([
        //     {
        //       role: "system",
        //       content:
        //         "You are an AI assistant specialized in evaluating and filtering search engine results to provide the most relevant information for a given query.",
        //     },
        //     {
        //       role: "user",
        //       content: `I have gathered search results from multiple platforms for the following query: "${query}". Below is a combined list of these search results, with each entry including a snippet, and URL:
      
        //     ${combinedResults
        //       .map(
        //         (result) =>
        //           `nDescription: ${result.snippet}\nURL: ${result.url}`
        //       )
        //       .join("\n\n")}
      
        //     Please evaluate the relevance and quality of these results, and select the 5 most useful URLs that best match the query intent. Your output should be a list of URLs in descending order of relevance, focusing on:
        //     1. Authoritative sources
        //     2. Clear and relevant information
        //     3. Unique insights or perspectives on the topic.
      
        //     Only return the URLs in the final output, with each URL on a new line.`,
        //     },
        //   ])

        return res.json({
            result: JSON.parse(duckDuckGoResults)
        })
    }
}
