import { useEffect, useState } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { Box, Button, Typography } from "@mui/material";
import { User } from "../../types/otherTypes";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ user, setUser }: Props) {
  const [ accessToken, setAccessToken ] = useState<string | null>(null);

  const login = useGoogleLogin({
      onSuccess: (loginResponse) => {
        setAccessToken(loginResponse.access_token)
      },
      onError: (error) => console.log("Login Failed:", error)
  });

  useEffect(() => {
    if (accessToken) {
      axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
        {
          headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json'
          }
        }
      )
      .then((res) => {
          console.dir(res.data)
          setUser({
            id: res.data.id,
            name: res.data.name,
            picture: res.data.picture 
          });
      })
      .catch((err) => console.log(err));
    }
  },[ accessToken, setUser ]);

    // log out function to log the user out of google
    const logOut = () => {
        googleLogout();
        setUser(null);
        setAccessToken(null);
    };

    return (
      user
      ? <Redirect to="/mainMenu" />
      : (<Box>
            <Typography variant="h2">React Google Login</Typography>
            <br />
            <br />
            <Button onClick={() => login()}>Sign in with Google 🚀 </Button>
        </Box>)
    );
};
