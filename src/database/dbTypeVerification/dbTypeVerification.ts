import { UserDB } from "../../types/otherTypes";

export const isUserObject = (obj: any): obj is UserDB => {
  console.log("User obj check:");
  console.dir(obj);
    return (
      typeof obj === "object" &&
      obj !== null &&
      "i" in obj &&
      typeof obj.i === "string" &&
      "n" in obj &&
      typeof obj.n === "string" &&
      "a" in obj &&
      typeof obj.a === "boolean" &&
      "c" in obj &&
      typeof obj.c === "number" &&
      "p" in obj &&
      (typeof obj.p === "string" || obj.picture === null)
    );
};
