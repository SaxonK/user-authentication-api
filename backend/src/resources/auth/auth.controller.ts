import { Router, Request, Response, NextFunction } from 'express';
import { authenticateRefreshTokenMiddlware } from '@/middleware/authenticated.middleware';
import Controller from '@/utils/interfaces/controller.interface';
import httpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import AuthService from '@/resources/auth/auth.service';
import validate from '@/resources/auth/auth.validation';

class AuthController implements Controller {
  public path = '/auth';
  public router = Router();

  private authService: AuthService;

  constructor() {
    this.initialiseRoutes();
    this.authService = new AuthService();
  };

  private initialiseRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.post(
      `${this.path}/logout`,
      authenticateRefreshTokenMiddlware,
      this.logout
    );
    this.router.post(
      `${this.path}/refresh`,
      authenticateRefreshTokenMiddlware,
      this.refresh
    );
  };

  private register = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const userCreated = await this.authService.register(firstName, lastName, email, password);

      if(!userCreated) next(new httpException(400, 'Unable to create user'));
      res.status(201).json({ message: `User create for ${email}` });
    } catch (error: any) {
      next(new httpException(400, error.message));
    };
  };

  private login = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      console.log(email, password);
      const tokens = await this.authService.login(email, password);
      if(tokens instanceof Error) {
        next(new httpException(500, tokens.message));
      } else {
        res.cookie('accessToken', tokens.access, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
          maxAge: 10 * 60 * 1000
        });
        res.cookie('refreshToken', tokens.refresh, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          signed: true,
          maxAge: 30 * 24 * 60 * 60 * 1000
        });
  
        res.status(200).json({ message: `Logged in successfully as ${email}` });
      };
    } catch (error: any) {
      console.log(error);
      next(new httpException(400, error.message));
    };
  };

  private logout = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if(!req.user) return next(new httpException(404, `No logged in user. ${req}`));
      const logout = await this.authService.logout(req.user);

      if(logout) {
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
    
        res.status(200).json({ message: 'user logged out.' });
      } else {
        next(new httpException(400, 'no user found.'));
      }
    } catch (error: any) {
      next(new httpException(400, error.message));
    };
  };

  private refresh = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const refreshToken = req.signedCookies['refreshToken'];
      if(!refreshToken) next(new httpException(401, 'Refresh token expired, please re-authenticate'));

      console.log('Refresh token validated');
      const accessToken = await this.authService.refresh(refreshToken);
      if(accessToken instanceof Error) next(new httpException(400, accessToken.message));

      console.log('Access token regenerated, not yet set');
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        signed: true,
        maxAge: 10 * 60 * 1000
      });

      res.status(200).json({ message: 'New access token assigned' });
    } catch (error: any) {
      next(new httpException(400, error.message));
    };
  };
};

export default AuthController;