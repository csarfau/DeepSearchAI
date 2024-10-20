import { tavily } from "@tavily/core";
import { config } from 'dotenv';

export default class TavilyContentExtractor{
    private readonly urlList:string[];
    private readonly tvly;
    
    constructor(urlList:{ urls: string[]}){
        config();
        const apiKey = process.env.TAVILY_API_KEY;
        this.urlList = urlList['urls'];
        this.tvly = tavily({ apiKey });
    }

    // private async extractMaxFiveUrl(list:string[]){
    //     return await this.tvly.extract(list);
    // }

    public async extractAll(){
        // console.log('teste lista: ', this.urlList)
        // const urls = this.urlList[0]
        // console.log(urls)
        const urlsExtracted = await this.tvly.extract(this.urlList);
        return urlsExtracted;
    }
}