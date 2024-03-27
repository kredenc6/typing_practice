import axios from "axios";

export default function createUser(email: string, password: string, verification: string) {
  return axios.post(
    "/.netlify/functions/proxy/createUser",
    { email, password, verification }
  );
}