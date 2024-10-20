import { Router } from 'express';
import SearchController from '../controllers/searchController';
import { authMiddleware } from '../middlewares/authMiddleware';

const searchRouter = Router();

const searchController = new SearchController();

searchRouter.use(authMiddleware);
searchRouter.get('/search/:id', searchController.getSearchById.bind(searchController));
searchRouter.get('/searches', searchController.getAllSearchsByUserId.bind(searchController));
searchRouter.post('/search', searchController.searchRetrieve.bind(searchController));
searchRouter.delete('/search/:id', searchController.deleteSearchById.bind(searchController));

export default searchRouter;