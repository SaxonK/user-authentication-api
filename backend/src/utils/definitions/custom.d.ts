import { User } from "@/resources/auth/auth.model";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    };
  };
};