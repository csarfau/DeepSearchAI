import { Request, Response, NextFunction } from "express";
import SearchAiResponseGenerateService from "../services/searchAiResponseGenerateService";

export default class SearchController {
  private readonly searchAiResponseGenerageService: SearchAiResponseGenerateService;

  constructor() {
    this.searchAiResponseGenerageService =
      new SearchAiResponseGenerateService();
  }

  public searchRetrieve = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const query = req.body.query;

      const stream = this.searchAiResponseGenerageService.generateAiResponse(query);
      
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Transfer-Encoding", "chunked");

      for await (const chunk of stream) {

        if (chunk.type === 'error') {
          res.write(JSON.stringify(chunk));
          return res.end();
        }
        
        res.write(JSON.stringify(chunk));
      }

      return res.end();
    } catch (error) {
      throw error;
    }
  };
}
