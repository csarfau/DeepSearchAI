import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";

export default class SuggestionGenerationService {
    private llmInstance;

    constructor(llmInstance: ChatOpenAI<ChatOpenAICallOptions>) {
        this.llmInstance = llmInstance;
    }

    public async generate(suggestions: Array<string>) {

        const prompt = `
            As an AI assistant for a search engine application, your task is to generate 4 compelling and diverse search suggestions based on the following themes: ${suggestions.join(', ')}.

            Requirements:
            1. Create exactly 4 suggestions, each focusing on a single theme from the provided list.
            2. Each suggestion should be concise, between 3-6 words long, and formulated as a search query.
            3. Ensure all suggestions are unique and avoid repetition.
            4. Make the suggestions specific, intriguing, and likely to spark the user's curiosity.
            5. Incorporate current trends, popular topics, or interesting angles related to each theme when applicable.

            Output Format:
            - Provide the result as a valid JSON object.
            - Each key should be a theme from the input list.
            - Each value should be the corresponding search suggestion.

            Example Output:
            {
                "cooking": "innovative vegan dessert recipes",
                "travel": "hidden gems in Southeast Asia",
                "art": "emerging street artists 2024",
                "programming": "AI-powered code refactoring techniques"
            }

            Generate diverse and engaging suggestions that will encourage users to explore their interests further.
        `;

        const response = await this.llmInstance.invoke([
            {
                role: "user",
                content: prompt
            }
        ]);

        const startIndex = response.content.toString().indexOf('{');
        const endIndex = response.content.toString().lastIndexOf('}') + 1;

        const formattedResponse = JSON.parse(response.content.toString().slice(startIndex, endIndex));
        
        return formattedResponse; 
    }
}