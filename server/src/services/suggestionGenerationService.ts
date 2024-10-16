import { AIMessageChunk } from "@langchain/core/messages";

import { google } from "googleapis";
import { config } from "dotenv";
import llm from '../openIA/chatOpenIA';
config();

const customsearch = google.customsearch("v1");

const googleApiKey = process.env.GOOGLE_API_KEY;
const cseId = process.env.GOOGLE_CX_ID;

export interface PageSuggestion {
    title: string;
    link: string;
    summary: string;
    imageUrl?: string;
}

export default class SuggestionGenerationService {

    private formatResponse (aiMsg: AIMessageChunk) {
        
        const startIndex = aiMsg.content.toString().indexOf('{');
        const endIndex = aiMsg.content.toString().lastIndexOf('}') + 1;

        const formattedResponse = JSON.parse(aiMsg.content.toString().slice(startIndex, endIndex));
        
        return formattedResponse; 
    }

    public async generatePrompt(suggestions: Array<string>, wordLimit?: number) {

        const aiMsg = await llm.invoke([
            {
                role: "system",
                content: `
                    You are a highly creative AI assistant for a search engine application. Your task is to generate compelling and diverse search suggestions based on the user's themes.
                    Your suggestions must be concise, engaging, and based on current trends or unique aspects of each theme.
                `,
            },
            {
                role: "user",
                content: `
                    Here are the themes I want suggestions for: ${suggestions.join(', ')}.
                    
                    Requirements:
                    1. Generate exactly 4 search suggestions, each focusing on a different theme from the provided list.
                    ${ wordLimit && `2. Each suggestion should be between ${wordLimit} words long and be formulated as a search query.'`}
                    3. Avoid repetition. Make each suggestion unique and intriguing.
                    4. Use current trends, niche topics, or interesting angles for each theme.
            
                    Example Output:
                    {
                        "cooking": "2024's best vegan recipes",
                        "travel": "hidden gems in South America",
                        "art": "modern art movements of 2024",
                        "technology": "AI breakthroughs in medical research",
                        "trip": "eco-friendly travel destinations 2024",
                        "programming": "trending programming languages to learn",
                        "politics": "impact of youth voting trends 2024",
                        "sport": "emerging sports leagues to watch",
                        "music": "best underground artists of 2024",
                        "cooking": "quick meal prep ideas for busy nights",
                        "travel": "ultimate guide to solo travel",
                        "art": "top art festivals to visit this year",
                        "technology": "future of quantum computing",
                        "trip": "best scenic drives in Europe",
                        "programming": "top open-source projects to contribute to",
                        "politics": "latest developments in climate policy",
                        "sport": "best athletes to watch in 2024",
                        "music": "influential albums of the decade",
                        "cooking": "healthy meal plans for beginners",
                        "travel": "unique cultural experiences around the world",
                        "art": "impact of digital art on traditional media",
                        "technology": "how 5G will change communication",
                        "trip": "affordable travel hacks for families",
                        "programming": "how to master data science",
                        "politics": "global implications of recent elections",
                        "sport": "upcoming events in extreme sports",
                        "music": "music trends to watch in 2024",
                        "trip": "adventurous road trips in 2024",
                        "programming": "AI ethics in software development",
                        "politics": "impact of social media on elections",
                        "sport": "innovative training techniques in athletics"
                    }

                    Please return the result as a JSON object with themes as keys and search suggestions as values.
                `,
                },
        ]);
        return this.formatResponse(aiMsg); 
    }

    
    private async searchGoogle(query: string): Promise<PageSuggestion[]> {
        try {
            const response = await customsearch.cse.list({
                cx: cseId,
                q: query,
                auth: googleApiKey,
                num: 10,
                fields: 'items(title,link,snippet,pagemap/cse_image/src)',
            });
            
            return (response.data.items || []).map((item) => ({
                title: item.title || '',
                link: item.link || '',
                summary: item.snippet || '',
                imageUrl: item.pagemap?.cse_image?.[0]?.src,
            }));
        } catch (error) {
            console.error(`Error in Google search for query "${query}":`, error);
            return [];
        }
    }
    
    public async generatePagesSuggestions(suggestions: string[]): Promise<Array<Array<PageSuggestion>>> {
        try {
            const querySuggestions = await this.generatePrompt(suggestions);
            const searchPromises = Object.entries(querySuggestions).map(
                ([theme, query]) => this.searchGoogle(query as string)
            );
        return await Promise.all(searchPromises);
        } catch (error) {
            console.error('Error in generatePagesSuggestions:', error);
            return [];
        }
    }
}