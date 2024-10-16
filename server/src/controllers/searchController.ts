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
    next: NextFunction
  ) => {
    const query = req.body.query;

    const result =
      await this.searchAiResponseGenerageService.generateAiResponse(query);

    return res.status(200).json({ data: result });
  };
}
