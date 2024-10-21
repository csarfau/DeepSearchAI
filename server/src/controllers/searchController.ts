import { Request, Response } from "express";
import SearchAiResponseGenerateService from "../services/searchAiResponseGenerateService";
import SearchRepository from "../repositories/searchRepository";
import { CustomError } from "../helpers/customError";
import { RequestBodyValidator, RequestParamValidator } from "../helpers/requestValidator";

export default class SearchController {
  private readonly searchAiResponseGenerageService: SearchAiResponseGenerateService;
  private readonly searchRepository: SearchRepository;

  constructor() {
    this.searchAiResponseGenerageService =
      new SearchAiResponseGenerateService();
    this.searchRepository = new SearchRepository();
  }

  public getSearchById = async (req: Request, res: Response) => {
    const { id = '' } = new RequestParamValidator(req.params).uuid().validate();
    const user = req.user;

    if (!user)
      return new CustomError(401, "Unauthorized access. Please log in.");

    const search = await this.searchRepository.getSearchById(id);

    if (!search) {
      return res.status(404).json({ error: "Search not found!" });
    }

    if (user.id !== search.user_id)
      return new CustomError(403, "Access Denied.");

    return res.status(200).json(search);
  };

  public getAllSearchsByUserId = async (req: Request, res: Response) => {
    const user = req.user;
    
    if (!user)
      return new CustomError(401, "Unauthorized access. Please log in!");
    
    const userSearchs = await this.searchRepository.getAllSearchsByUserId(
      user.id
    );
    
    if (userSearchs.length === 0) return new CustomError(404, "No data found!");
    
    return res.status(200).json(userSearchs);
  };

  public searchRetrieve = async (req: Request, res: Response) => {
    if (!req.user)
      return new CustomError(401, "Unauthorized access. Please log in!");

    const { query = '' } = new RequestBodyValidator(req.body).query().validate();

    let result: string = "";

    const stream =
      this.searchAiResponseGenerageService.generateAiResponse(query);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    for await (const chunk of stream) {
      if (chunk.type === "content") {
        result += chunk.content;
      }
      if (chunk.type === "done") {
        await this.searchRepository.createSearch({
          user_id: req.user.id,
          query,
          result,
        });
      }
      res.write(JSON.stringify(chunk));
    }

    return res.end();
  };

  public deleteSearchById = async (req: Request, res: Response) => {
    const {id = ''} = new RequestParamValidator(req.params).uuid().validate();
    const user = req.user;

    if (!user)return new CustomError(401, "Unauthorized access. Please log in!");

    const toDelete = await this.searchRepository.getSearchById(id);

    if (!toDelete) return new CustomError(404, "No data found to delete");

    if(toDelete.user_id !== user.id) new CustomError(403, "Action Denied.");

    const deleted = await this.searchRepository.deleteSearchById(id);

    if(!deleted) throw new Error();

    return res.status(200).json(deleted);
  };
}
