import { CompressedText, User } from "../types/otherTypes";

export const isUserObject = (obj: any): obj is User => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      "id" in obj &&
      typeof obj.id === "string" &&
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

export const isCompressedText = (obj: any): obj is CompressedText => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "compressedText" in obj &&
    typeof obj.compressedText === "object" &&
    "compressedTextLength" in obj &&
    typeof obj.compressedTextLength === "number"
  )
};
