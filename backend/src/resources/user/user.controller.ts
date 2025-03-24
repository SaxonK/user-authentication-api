import { Router, Request, Response, NextFunction } from 'express';
import { authenticateAccessTokenMiddlware } from '@/middleware/authenticated.middleware';
import Controller from '@/utils/interfaces/controller.interface';
import httpException from '@/utils/exceptions/http.exception';
import UserService from '@/resources/user/user.service';

class UserController implements Controller {
  public path = '/user';
  public router = Router();

  private userService: UserService;

  constructor() {
    this.initialiseRoutes();
    this.userService = new UserService();
  };

  private initialiseRoutes(): void {
    this.router.get(`${this.path}`, authenticateAccessTokenMiddlware, this.getUser);
    this.router.post(`${this.path}/deactivate`, authenticateAccessTokenMiddlware, this.deactivate);
    this.router.put(`${this.path}/update`, authenticateAccessTokenMiddlware, this.update);
  };

  private getUser = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if(!req.user) return next(new httpException(404, `No logged in user. ${req}`));

    res.status(200).json({ user: req.user });
  };

  private deactivate = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if(!req.user) return next(new httpException(404, `No logged in user. ${req}`));

      const userDeactivated = await this.userService.deactivateUser(req.user.id);

      if (userDeactivated) {
        res.clearCookie('accessToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
          maxAge: 0
        });
        res.clearCookie('refreshToken', {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
          maxAge: 0
        });
        res.status(200).json({ message: 'User account has been deactivated.' });
      } else {
        next(new httpException(500, 'An unexpected error occured.'));
      }

    } catch (error: any) {
      next(new httpException(400, error.message));
    };
  };

  private update = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if(!req.user) return next(new httpException(404, `No logged in user. ${req}`));
      const { firstName, lastName, email, company, country, phoneNumber, profilePicture } = req.body;
      const userUpdated = await this.userService.updateUser(req.user.id, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        company: company,
        country: country,
        phoneNumber: phoneNumber,
        profilePicture: profilePicture
      });

      if (userUpdated) {
        res.status(200).json({ message: 'User details have been updated.' });
      } else {
        next(new httpException(500, 'An unexpected error occured.'));
      }
    } catch (error: any) {
      next(new httpException(400, error.message));
    }
  };  
};

export default UserController;