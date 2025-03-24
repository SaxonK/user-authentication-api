import { encryptPassword, checkPassword } from '@/utils/encryption';
import { Repository } from 'typeorm';
import { User } from "@/resources/user/user.model";
import { generateAccessToken, generateRefreshToken, verifyJwtToken, verifyTokenIssuedAfterLastLogout } from '@/utils/token';
import AppDataSource from '@/config/dataSource';
import jwt from 'jsonwebtoken';

export default class AuthService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Registers a new user account.
   */
  public async register(firstName: string, lastName: string, email: string, password: string): Promise<boolean | Error> {
    try {
      const existingUser = await this.userRepository.findOne({
        select: ['createdDate', 'email', 'firstName', 'hash', 'id', 'isActive', 'lastLogoutDateTime', 'lastName', 'lastUpdatedDate'],
        where: {
          email: email,
        }
      });

      if(existingUser) throw new Error(`An account already exists for the email address ${existingUser.email}`);

      const hashedPassword = await encryptPassword(password);
      const user = this.userRepository.create({ firstName, lastName, email, hash: hashedPassword });
      this.userRepository.save(user);

      return true;
    } catch (error) {
      throw new Error('Unable to create user');
    }
  };

  /**
   * Attempt to login to the requested user account.
   */
  public async login(email: string, password: string): Promise<Record<'access' | 'refresh', string> | Error> {
    try {
      const user = await this.userRepository.findOne({
        select: ['createdDate', 'email', 'firstName', 'hash', 'id', 'isActive', 'lastLogoutDateTime', 'lastName', 'lastUpdatedDate'],
        where: {
          email: email,
        }
      });

      if (!user) throw new Error('Invalid username or password');
      if(!user.isActive) throw new Error('User account disabled');

      if(await checkPassword(password, user.hash)) {
        const tokens = {
          access: generateAccessToken(user),
          refresh: generateRefreshToken(user)
        };
        return tokens;
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      };
    };
  };

  /**
   * Attempt to login to the requested user account.
   */
  public async logout(user: User): Promise<boolean | Error> {
    try {
      user.lastLogoutDateTime = new Date();
      await this.userRepository.save(user);

      return true;
    } catch (error: any) {
      if (error instanceof Error) {
        console.log(error.message);
        throw new Error(error.message);
      } else {
        throw new Error('An unknown error occurred');
      };
    };
  };

  /**
   * Get a new access token
   */
  public async refresh(refreshToken: string): Promise<string | Error> {
    try {
      const verifiedToken = await verifyJwtToken(refreshToken, 'refresh');
      if(verifiedToken instanceof jwt.JsonWebTokenError) throw new Error('Unauthorised');

      const user = await this.userRepository.findOne({
        select: ['createdDate', 'email', 'firstName', 'hash', 'id', 'isActive', 'lastLogoutDateTime', 'lastName', 'lastUpdatedDate'],
        where: { id: verifiedToken.id }
      });
      if(!user) throw new Error('Unauthorised');

      const verifiedLastLogout = await verifyTokenIssuedAfterLastLogout(verifiedToken, user);
      
      if(verifiedLastLogout) {
        return generateAccessToken(user);
      } else {
        throw new Error('Unauthorised');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };
};