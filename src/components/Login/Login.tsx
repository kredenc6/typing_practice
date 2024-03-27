import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { signInWithPopup, browserLocalPersistence, inMemoryPersistence, AuthProvider } from "firebase/auth";
import { auth } from "../../database/firebase";
import { Box, Paper, Typography } from "@mui/material";
import { User } from "../../types/otherTypes";
import handleError from "../../helpFunctions/handleError";
import { getUser, saveUser } from "../../database/endpoints";
import { extractUserDBFromUser, extractUserFromDbUser } from "../../appHelpFunctions";
import LoginForm from "../LoginForm";
import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";

interface Props {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsRecaptchaBadgeVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({ user, setUser, setIsRecaptchaBadgeVisible }: Props) {
  const [rememberTheUser, setRememberTheUser] = useState(!!user);

  // TODO dear lord please change the name to something like "toggleCreateAccount" or similar.
  // Also setCreateAccount is passed along as createAcount which is even more confusing. Fix!
  const [createAccount, setCreateAccount] = useState(false);

  const handleCheckboxChange = () => {
    setRememberTheUser(prev => !prev);

    const persistence = !rememberTheUser
      ? browserLocalPersistence
      : inMemoryPersistence;
    
    auth.setPersistence(persistence)
      .then(() => {
        let test = auth as any;
        console.log(`persistence type: ${test.persistenceManager.persistence.type}`);
      });
  };

  useEffect(() => {
    console.log(`user in login page: ${user?.id}`);
    if(!user) {
      auth.setPersistence(inMemoryPersistence)
        .then(() => {
          let test = auth as any;
          console.log(`persistence type: ${test.persistenceManager.persistence.type}`);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // toggle reCAPTCHA badge visibility
  useEffect(() => {
    setIsRecaptchaBadgeVisible(true);

    return () => { setIsRecaptchaBadgeVisible(false); }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    return (
      user
      ? <Redirect to="/mainMenu" />
      : (
        <Box>
          <Paper
            elevation={3}
            sx={{ width: "40rem", p: "2rem", textAlign: "center", mx: "auto", marginTop: "20vh" }}
          >
            <Typography variant="h2" sx={{ marginBottom: "1rem" }}>Deset prstů</Typography>
            {createAccount
              ? <CreateAccountForm createAccount={setCreateAccount} />
              : <LoginForm
                  createAccount={setCreateAccount}
                  handleCheckboxChange={handleCheckboxChange}
                  rememberTheUser={rememberTheUser}
                  login={(provider: AuthProvider) => login(provider, setUser)} />
            }
          </Paper>
        </Box>
        )
    );
};

// https://firebase.google.com/docs/auth/web/google-signin
function login(provider: AuthProvider, callback: (user: User | null) => void) {
  signInWithPopup(auth, provider)
    .then( async (result) => {

      // find out if the user already exists in the database
      try {
        const userDB = await getUser(result.user.uid);

        // if the user exist, save him to the state
        if(userDB) {
          const user = extractUserFromDbUser(userDB);
          callback(user);
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
        callback(newUser);
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
