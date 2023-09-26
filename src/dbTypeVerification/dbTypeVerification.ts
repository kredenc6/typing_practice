import { User } from "../types/otherTypes";

export const isUserObject = (obj: any): obj is User => {
  console.dir("userObj");
  console.dir(obj);
    return (
      typeof obj === "object" &&
      obj !== null &&
      "name" in obj &&
      typeof obj.name === "string" &&
      "isAdmin" in obj &&
      typeof obj.isAdmin === "boolean" &&
      "createdAt" in obj &&
      typeof obj.createdAt === "number" &&
      "picture" in obj &&
      (typeof obj.picture === "string" || obj.picture === null)
    );
};
