import express from "express";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../src/database/firebase";
import { FirebaseError } from "firebase/app";
import getFirebaseErrorHttpStatusCode from "../createUser/getFirebaseErrorHttpStatusCode";
import { getUser, saveUser } from "../../../src/database/endpoints";
import { formatToUserDBFromUser, formatToUserFromDbUser } from "../../../src/appHelpFunctions";
import type { User } from "../../../src/types/otherTypes";
import { ADMIN_EMAIL } from "../../../src/constants/secretConstants";

const router = express.Router();

router.post("/loginUserWithEmail", async (req, res) => {
  const { email, password } = req.body;

  try {
    const loginUserResponse = await signInWithEmailAndPassword(auth, email, password);

    // Find out if the user already exists in the database.
    try {
      const userDB = await getUser(loginUserResponse.user.uid);

      // If the user exist, send it to the frontend.
      if(userDB) {
        const user = formatToUserFromDbUser(userDB);
        return res.json(user);
      }
    }

    // Failed to load the user from the DB.
    catch(error) {
      const errorMessage = `Failed to load the user ${loginUserResponse.user.uid} from the database`;
      return res.status(500).send(errorMessage);
    }

  // Failed to load the user from the Firebase service.
  } catch(error) {
    if(error instanceof FirebaseError) {
      console.log(error);
      const status = getFirebaseErrorHttpStatusCode(error.code);
      return res.status(status).send(error.message);
    }
    
    if(error instanceof Error) {
      return res.status(500).send(error.message);
    }
    
    console.log(error);
    res.status(500).send("An unknown error occured during the user login.");
  }
});

// https://firebase.google.com/docs/auth/web/google-signin
router.get("/loginUserWithGoogle", async (_, res) => {
  signInWithPopup(auth, googleProvider)
    .then( async (loginUserResponse) => {

      // Find out if the user already exists in the database.
      try {
        const userDB = await getUser(loginUserResponse.user.uid);

        // If the user exist, send it to the frontend.
        if(userDB) {
          const user = formatToUserFromDbUser(userDB);
          return res.json(user);
        }
      }
      catch(error) {
        const errorMessage = `Failed to load the user ${loginUserResponse.user.uid} from the database`;
        res.status(500).send(errorMessage);
      }

      // if the user doesn't exist in the database create a new user...
      const newUser: User = {
        id: loginUserResponse.user.uid,
        name: loginUserResponse.user.displayName,
        picture: loginUserResponse.user.photoURL,
        isAdmin: loginUserResponse.user.email === ADMIN_EMAIL,
        createdAt: Date.now()
      };

      // ...and save the new user to the database and the state
      const newUserDB = formatToUserDBFromUser(newUser)!;
      try {
        await saveUser(loginUserResponse.user.uid, newUserDB);
        return res.json(newUserDB);
      }
      catch(error) {
        const errorMessage = `Failed to save the user ${newUser.name} to the database`;
        res.status(500).send(errorMessage);
      }
    })
    .catch(error => {
      const errorMessage = `Login failed. ${error.message}`;
      res.status(500).send(errorMessage);
    });
});

export default router;
