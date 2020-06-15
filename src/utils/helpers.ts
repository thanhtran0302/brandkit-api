import { NextFunction, Request, Response } from 'express';
import jwtDecode from 'jwt-decode';

export interface TokenProps {
  uid: string;
  expiredAt: number;
}

export const accessControlAllowHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method !== 'OPTIONS' && req.headers['x-requested-with']) {
    res.locals = {
      xRequestWith: req.headers['x-requested-with']
    };
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, X-Version, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Expose-Headers', 'X-Version');

  next();
};

export const authorizationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    headers: { authorization },
    method
  } = req;

  const whiteList = ['/api/health'];

  if (whiteList.includes(req.path) || method === 'OPTIONS') {
    return next();
  }

  try {
    const user: TokenProps | null = decodeToken(authorization);

    if (!user) {
      throw new Error('no user');
    }

    if (user && isExpiredToken(user.expiredAt)) {
      return res.status(401).send({ errors: ['expiredUser'] });
    }
    return next();
  } catch (error) {
    return res.status(401).send({ errors: ['noTokenFound'] });
  }
};

export const isProduction = (): boolean =>
  process.env.NODE_ENV === 'production';

export const decodeToken = (token?: string): TokenProps | null =>
  (token && jwtDecode(token)) || null;

export const isExpiredToken = (date: number): boolean => date < Date.now();
