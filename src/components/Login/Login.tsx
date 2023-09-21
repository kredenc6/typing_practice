import { Redirect } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "../../config/firebase";
import { Box, Button, Typography } from "@mui/material";
import { User } from "../../types/otherTypes";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ user, setUser }: Props) {

  // https://firebase.google.com/docs/auth/web/google-signin
  const login = () => signInWithPopup(auth, provider)
    .then((result) => {
      setUser({
        id: result.user.uid,
        name: null,
        picture: null
      });
    })
    // TODO finish error handling
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

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
