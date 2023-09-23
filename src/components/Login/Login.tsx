import { Redirect } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../config/firebase";
import { Box, Button, Typography } from "@mui/material";
import { User } from "../../types/otherTypes";
import { doc, setDoc, getDoc, DocumentSnapshot, DocumentData } from "firebase/firestore";
import handleTryCatchError from "../../helpFunctions/handleTryCatchError";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ user, setUser }: Props) {

  // https://firebase.google.com/docs/auth/web/google-signin
  const login = () => signInWithPopup(auth, provider)
    .then( async (result) => {

      const userRef = doc(db, "users", result.user.uid);
      let userSnap: DocumentSnapshot<DocumentData, DocumentData> | null = null;

      // find out if the user already exists in the database
      try {
        userSnap = await getDoc(userRef);
      }
      catch(error) {
        const errorMessage = `Failed to load the user ${result.user.uid} from the database`;
        handleTryCatchError(error, errorMessage);
        return;
      }

      // if the user exist, save him to the state...
      if (userSnap.exists()) {
        setUser({...userSnap.data() as User });
        
      // ssselse create a new user...
      } else {
        const resultUser: User = {
          name: result.user.displayName,
          picture: result.user.photoURL,
          isAdmin: result.user.email === "filip.sran@gmail.com",
          createdAt: Date.now()
        };

        // ...and save the new user to the database and the state
        try {
          await setDoc(doc(db, "users", result.user.uid), resultUser);
          setUser(resultUser);
        }
        catch(error) {
          const errorMessage = `Failed to save the user ${resultUser.name} to the database`;
          handleTryCatchError(error, errorMessage);
        }
        
      }
    })
    // TODO finish error handling
    .catch((error) => {
      console.dir("error");
      console.dir(error);
      // // Handle Errors here.
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // // ...
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
