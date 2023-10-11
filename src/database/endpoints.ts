import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { isUserObject } from "./dbTypeVerification/dbTypeVerification";
import { UserDB } from "../types/otherTypes";

export const getUser = async (userId: string): Promise<UserDB | null> => {
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
    
  return null;
};

export const saveUser = async (userId: string, user: UserDB) => {
  const userRef = doc(db, "users", userId);
  return await setDoc(userRef, user);
};

export const updateUser = async (userId: string, updates: Partial<UserDB>) => {
  const userRef = doc(db, "users", userId);
  return await setDoc(userRef, { ...updates }, { merge: true });
};

export const loadMistypedWordsFromDB = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if(userSnap.exists()) {

  } else {
    throw new Error(`The user ${userId} was not found.`);
  }
};
