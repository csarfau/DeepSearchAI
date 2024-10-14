import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import auth from '../utils/auth';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => { 
  const authHeader = req.headers.authorization;
  if(!authHeader) {
    return res.status(401).json({ message: "JWT Token is missing." });
  }

  const token = authHeader.split(' ')[1];

  try {
    verify(token, auth.jwt.secret);
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid JWT Token" });
  }

};