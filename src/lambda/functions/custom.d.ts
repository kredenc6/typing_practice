import { SessionData } from "express-session";

// Extend the express-session module
declare module "express-session" {
  interface SessionData {
    createUserInProgress?: boolean;
  }
}
