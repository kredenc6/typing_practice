import { signInWithPopup, type AuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";

// https://firebase.google.com/docs/auth/web/google-signin
export const loginWithProvider = async (provider: AuthProvider) => {
  await signInWithPopup(auth, provider);
}

export const loginWithEmail = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
}
