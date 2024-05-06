import { sendEmailVerification, type User } from "firebase/auth";
import { URLS } from "../constants/constants";

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: URLS.LOCAL, // TODO replace with .APP for production
  handleCodeInApp: false
};

export default function sendVerificationEmail(firebaseUser: User) {
  return sendEmailVerification(firebaseUser, actionCodeSettings);
}
