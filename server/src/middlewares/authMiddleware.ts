import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/token';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => { 
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).json({ message: "JWT Token is missing." });
  }

  const token = authHeader.split(' ')[1];

  try {
    const authenticatedUser = verifyToken(token);
    if(!authenticatedUser) {
      throw new Error();
    }

    req.user = { id: authenticatedUser.id, email: authenticatedUser.email, definedTheme: authenticatedUser.definedTheme }

    return next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid JWT Token" });
  }

};