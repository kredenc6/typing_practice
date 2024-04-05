import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { isUserObject } from "./dbHelpFunctions/dbTypeVerification";
import { type UserDB } from "../types/otherTypes";

export const getUser = async (userId: string): Promise<UserDB> => {
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
    
  throw new Error(`User ${userId} doesn't exits in the database.`);
};

export const isUserInDB = async (userId: string): Promise<boolean> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists();
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

  if(!userSnap.exists()) {
    throw new Error(`The user ${userId} was not found.`);
  }
};
