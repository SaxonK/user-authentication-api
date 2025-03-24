import type { UpdateUserDTO } from '@/utils/interfaces/user.interface';
import { encryptPassword, checkPassword } from '@/utils/encryption';
import { Repository } from 'typeorm';
import { User } from "@/resources/user/user.model";
import { generateAccessToken, generateRefreshToken, verifyJwtToken, verifyTokenIssuedAfterLastLogout } from '@/utils/token';
import AppDataSource from '@/config/dataSource';
import jwt from 'jsonwebtoken';

export default class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * De-activate the users account.
   */
  public async deactivateUser(userId: string): Promise<boolean | Error> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        }
      });
      if (!user) throw new Error('User not found');

      user.isActive = false;
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
   * Update user details.
   */
  public async updateUser(userId: string, updateValues: UpdateUserDTO): Promise<boolean | Error> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        }
      });
      if (!user) throw new Error('User not found');
    
      Object.assign(user, updateValues);
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
};