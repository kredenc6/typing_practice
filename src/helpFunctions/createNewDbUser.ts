import type { User as FirebaseUser } from "firebase/auth";
import { ADMIN_EMAIL } from "../constants/secretConstants";
import type { User } from "../types/otherTypes";
import { isUserObject } from "../database/dbHelpFunctions/dbTypeVerification";
import { formatToUserDBFromUser } from "../appHelpFunctions";

export default function createNewUser(user: FirebaseUser) {
  const newUser: User = {
    id: user.uid,
    name: user.displayName || "anonymous",
    picture: user.photoURL,
    isAdmin: user.email === ADMIN_EMAIL,
    createdAt: Date.now()
  };

  // DB user type verification:
  const dbUser = formatToUserDBFromUser(newUser);
  if(!isUserObject(dbUser)) {
    throw new Error("Invalid newUser object.");
  }

  return newUser;
}
