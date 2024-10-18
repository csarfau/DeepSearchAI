import { Router } from 'express';
import SearchController from '../controllers/searchController';

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.post('/search', searchController.searchRetrieve.bind(searchController));

export default searchRouter;