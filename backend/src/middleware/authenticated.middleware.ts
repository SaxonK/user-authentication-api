import type Token from "@/utils/interfaces/token.interface";
import { Request, Response, NextFunction } from "express";
import { verifyJwtToken, verifyTokenIssuedAfterLastLogout } from '@/utils/token';
import { User } from "@/resources/user/user.model";
import AppDataSource from '@/config/dataSource';
import httpException from "@/utils/exceptions/http.exception";
import jwt from "jsonwebtoken";

export const authenticateAccessTokenMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.signedCookies['accessToken'];
    if(!token) return next(new httpException(401, 'Unauthorised. No signed cookie.'));

    const payload: Token | jwt.JsonWebTokenError = await verifyJwtToken(token, 'access');
    if(payload instanceof jwt.JsonWebTokenError) return next(new httpException(401, 'Unauthorised. Failed verification.'));

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.id }
    });
    if(!user) return next(new httpException(401, 'Unauthorised. User not found.'));
    if(!user.isActive) return next(new httpException(403, 'User account disabled.'));
    
    const tokenValidAfterLastLogout = await verifyTokenIssuedAfterLastLogout(payload, user);
    if(!tokenValidAfterLastLogout) return next(new httpException(401, 'Unauthorised. Access Token invalid.'));

    req.user = user;

    return next();
  } catch (error) {
    return next(new httpException(401, 'Unauthorised. Unexpected error.'));
  };
};

export const authenticateRefreshTokenMiddlware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.signedCookies['refreshToken'];
    if(!token) return next(new httpException(401, 'Unauthorised.'));
    console.log('refresh token retreived.');

    const payload: Token | jwt.JsonWebTokenError = await verifyJwtToken(token, 'refresh');
    if(payload instanceof jwt.JsonWebTokenError) return next(new httpException(401, 'Unauthorised.'));
    console.log('JWT token verified.');

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: payload.id }
    });
    if(!user) return next(new httpException(401, 'Unauthorised.'));
    if(!user.isActive) return next(new httpException(403, 'User account disabled.'));
    
    const tokenValidAfterLastLogout = await verifyTokenIssuedAfterLastLogout(payload, user);
    if(!tokenValidAfterLastLogout) return next(new httpException(401, 'Unauthorised. Refresh Token invalid.'));
    
    req.user = user;

    return next();
  } catch (error) {
    return next(new httpException(401, 'Unauthorised.'));
  };
};