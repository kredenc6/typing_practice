import { Redirect } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, db, provider } from "../../config/firebase";
import { Box, Button, Paper, Typography } from "@mui/material";
import { User } from "../../types/otherTypes";
import { doc, setDoc, getDoc, DocumentSnapshot, DocumentData } from "firebase/firestore";
import handleError from "../../helpFunctions/handleError";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { isUserObject } from "../../dbTypeVerification/dbTypeVerification";


// TODO Změň název aplikace v:
// Budete-li pokračovat, Google bude sdílet vaše jméno, e‑mailovou adresu, předvolbu jazyka a profilovou fotku s aplikací typing-practice-399508.firebaseapp.com.
// I can't find it!!!!!!! ^&*&^&@#$%@#&@#%@#$#%@#!!!

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
        handleError(error, errorMessage);
        return;
      }

      // if the user exist, save him to the state and localStorage...
      if (userSnap.exists()) {
        const existingUser = {...userSnap.data() as User };
        
        // typeguard
        if(!isUserObject(existingUser)) {
          throw new Error("Received an invalid user object.");
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(existingUser));
        setUser(existingUser);
        
      // else create a new user...
      } else {
        const newUser: User = {
          name: result.user.displayName,
          picture: result.user.photoURL,
          isAdmin: result.user.email === "filip.sran@gmail.com",
          createdAt: Date.now()
        };

        // ...and save the new user to the database and the state
        try {
          await setDoc(doc(db, "users", result.user.uid), newUser);
          localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(newUser));
          setUser(newUser);
        }
        catch(error) {
          const errorMessage = `Failed to save the user ${newUser.name} to the database`;
          handleError(error, errorMessage);
        }
        
      }
    })
    .catch((error) => {
      const message = `Login failed. ${error.message}`;
      handleError(error, message);
    });

    return (
      user
      ? <Redirect to="/mainMenu" />
      : (
        <Box>
          <Paper
            elevation={3}
            sx={{ width: "30rem", p: "2rem", textAlign: "center", mx: "auto", marginTop: "20vh" }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: "1rem" }}
            >
              přihlášení
            </Typography>
            <Typography variant="h2" sx={{ marginBottom: "3rem" }}>Deset prstů</Typography>
            <Button
              onClick={() => login()}
              variant="contained"
            >
              Přihlásit se přes Google účet
            </Button>
          </Paper>
        </Box>
        )
    );
};
