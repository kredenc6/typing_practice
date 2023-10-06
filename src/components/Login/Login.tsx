import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { setPersistence, signInWithPopup, browserLocalPersistence, inMemoryPersistence } from "firebase/auth";
import { auth, provider } from "../../database/firebase";
import { Box, Button, Checkbox, FormControlLabel, Paper, Typography } from "@mui/material";
import { User, UserDB } from "../../types/otherTypes";
import handleError from "../../helpFunctions/handleError";
import { getUser, saveUser } from "../../database/endpoints";
import { extractUserDBFromUser, extractUserFromDbUser } from "../../appHelpFunctions";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function Login({ user, setUser }: Props) {
  const [rememberTheUser, setRememberTheUser] = useState(false);

  const handleCheckboxChange = () => setRememberTheUser(prevState => !prevState);

  // TODO extract to custom hook
  useEffect(() => {
    if(rememberTheUser) {
      setPersistence(auth, browserLocalPersistence);
    } else {
      setPersistence(auth, inMemoryPersistence);
    }
  }, [rememberTheUser])

  // // https://firebase.google.com/docs/auth/web/google-signin
  // const login = () => signInWithPopup(auth, provider)
  //   .then( async (result) => {

  //     // find out if the user already exists in the database
  //     try {
  //       const user = await getUser(result.user.uid);

  //       // if the user exist, save him to the state
  //       if(user) {
  //         setUser(user);
  //         return;
  //       }
  //     }
  //     catch(error) {
  //       const errorMessage = `Failed to load the user ${result.user.uid} from the database`;
  //       handleError(error, errorMessage);
  //       return;
  //     }

  //     // if the user doesn't exist in the database create a new user...
  //     const newUser: User = {
  //       name: result.user.displayName,
  //       picture: result.user.photoURL,
  //       isAdmin: result.user.email === "filip.sran@gmail.com", // BUG THIS CAN'T BE HERE LIKE THAT - EASY TO HACK!!!!
  //       createdAt: Date.now()
  //     };

  //     // ...and save the new user to the database and the state
  //     try {
  //       await saveUser(result.user.uid, newUser);
  //       setUser(newUser);
  //     }
  //     catch(error) {
  //       const errorMessage = `Failed to save the user ${newUser.name} to the database`;
  //       handleError(error, errorMessage);
  //     }
        
  //   })
  //   .catch(error => {
  //     const message = `Login failed. ${error.message}`;
  //     handleError(error, message);
  //   });

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
              onClick={() => login(setUser)}
              variant="contained"
            >
              Přihlásit se přes Google
            </Button>
            <Box>
              <FormControlLabel
                control={<Checkbox checked={rememberTheUser} onChange={handleCheckboxChange} />}
                label="Zůstat přihlášen"
              />
            </Box>
          </Paper>
        </Box>
        )
    );
};

// https://firebase.google.com/docs/auth/web/google-signin
function login(setUser: React.Dispatch<React.SetStateAction<User | null>>) {
  signInWithPopup(auth, provider)
    .then( async (result) => {

      // find out if the user already exists in the database
      try {
        const userDB = await getUser(result.user.uid);

        // if the user exist, save him to the state
        if(userDB) {
          const user = extractUserFromDbUser(userDB);
          setUser(user);
          return;
        }
      }
      catch(error) {
        const errorMessage = `Failed to load the user ${result.user.uid} from the database`;
        handleError(error, errorMessage);
        return;
      }

      // if the user doesn't exist in the database create a new user...
      const newUser: User = {
        id: result.user.uid,
        name: result.user.displayName,
        picture: result.user.photoURL,
        isAdmin: result.user.email === "filip.sran@gmail.com", // BUG THIS CAN'T BE HERE LIKE THAT - EASY TO HACK!!!!
        createdAt: Date.now()
      };

      // ...and save the new user to the database and the state
      const newUserDB = extractUserDBFromUser(newUser)!;
      try {
        await saveUser(result.user.uid, newUserDB);
        setUser(newUser);
      }
      catch(error) {
        const errorMessage = `Failed to save the user ${newUser.name} to the database`;
        handleError(error, errorMessage);
      }
    })
    .catch(error => {
      const message = `Login failed. ${error.message}`;
      handleError(error, message);
    });
}
