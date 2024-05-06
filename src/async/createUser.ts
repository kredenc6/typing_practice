import axios from "axios";
import type { User } from "firebase/auth";

// This is not handled on the frontend for a secure email and password validation.
export default async function createUser(
  email: string, password: string, verification: string
) {
  const { data: firebaseUser } = await axios.post<User>(
    "/.netlify/functions/proxy/createUser",
    { email, password, verification }
  ) ;

  return firebaseUser;
}
