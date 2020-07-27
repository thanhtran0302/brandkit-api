import { NextFunction, Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import { IProject } from '../routes/projects';

export interface TokenProps {
  email: string;
  userId: string;
  iat: number;
  exp: number;
}

export interface UserSessionInfos {
  token: string;
  user: TokenProps;
  project?: IProject;
}

export const accessControlAllowHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    method,
  } = req;

  const whiteList: string[] = ['/api/health', '/api/signup', '/api/login'];

  if (whiteList.includes(req.path) || method === 'OPTIONS') {
    return next();
  }

  try {
    const user: TokenProps | null = decodeToken(authorization);

    if (!user) {
      throw new Error('no user');
    }

    if (user && isExpiredToken(user.exp)) {
      return res.status(401).send({ errors: ['expiredUser'] });
    }
    res.locals = ({
      token: authorization,
      user,
    } as unknown) as UserSessionInfos;
    return next();
  } catch (error) {
    return res.status(401).send({ errors: ['noTokenFound'] });
  }
};

export const isProduction = (): boolean =>
  process.env.NODE_ENV === 'production';

export const decodeToken = (token?: string): TokenProps | null =>
  (token && jwtDecode(token)) || null;

export const isExpiredToken = (date: number): boolean =>
  date < unixTimestamp(Date.now());

export const unixTimestamp = (date: number): number => Math.floor(date / 1000);
