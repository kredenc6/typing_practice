import axios, { type AxiosResponse } from "axios";
import { type User } from "../types/otherTypes";

// This is not handled on the frontend for a secure email and password validation.
export default function createUser(
  email: string, password: string, verification: string
): Promise<AxiosResponse<User>> {
  return axios.post(
    "/.netlify/functions/proxy/createUser",
    { email, password, verification }
  );
}
