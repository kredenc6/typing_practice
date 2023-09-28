import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "../types/otherTypes";
import { isUserObject } from "../dbTypeVerification/dbTypeVerification";

export const getUser = async (userId: string): Promise<User> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const existingUser = {...userSnap.data() };
    
    // typeguard
    if(!isUserObject(existingUser)) {
      throw new Error("Received an invalid user object.");
    }

    return existingUser;
  }

  throw new Error(`Failed to get a user ${userId} from the database for an unknown reason.`);
};
