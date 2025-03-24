import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';

export const generateRefreshToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET as jwt.Secret, {
    expiresIn: '30d',
  });
};

export const generateAccessToken = (user: User): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_ACCESS_SECRET as jwt.Secret, {
    expiresIn: 60 * 10,
  });
};

export const verifyJwtToken = async (token: string, type: 'access' | 'refresh'): Promise<jwt.VerifyErrors | Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env[`JWT_${type.toUpperCase()}_SECRET`] as jwt.Secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as Token);
    });
  });
};

export const verifyTokenIssuedAfterLastLogout = async (token: Token, user: User): Promise<boolean> => {
  const tokenDate = new Date(token.iat);
  const lastLogout = user.lastLogoutDateTime !== undefined ? new Date(user?.lastLogoutDateTime) : null;
  if(lastLogout !== null && lastLogout > tokenDate) false;

  return true;
};