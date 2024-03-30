import * as yup from "yup";
import express, { type NextFunction, type Request, type Response } from "express";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../src/database/firebase";
import { FirebaseError } from "firebase/app";
import getFirebaseErrorHttpStatusCode from "./getFirebaseErrorHttpStatusCode";

interface SignIn {
  email: string;
  password: string;
  verification: string;
}

const signInSchema: yup.ObjectSchema<SignIn> = yup.object({
  email: yup.string().email().required("Invalid email."),
  password: yup.string().min(8).max(20).required("Invalid password."),
  verification: yup
    .string()
    .min(8)
    .max(20)
    .oneOf([yup.ref("password"), undefined])
    .required("Invalid password verification.")
});

const validate = (schema: yup.ObjectSchema<SignIn>) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return res.status(400).json({ type: "ValidationError", message: err.message });
    }
    
    return res.status(500).json({ type: "UnknownError", message: "An unknown error occurred." });
  }
};

const router = express.Router();

router.post("/createUser", validate(signInSchema), async (req, res) => {

  // Check if user creation process is ongoing for this session
  // if (req.session && req.session.createUserInProgress) {
  //   return res.status(409).send("User creation is already in progress.");
  // }

  // Set the flag to indicate user creation is in progress
  // if (req.session) {
  //   req.session.createUserInProgress = true;
  // }

  const { email, password } = req.body;

  try {
    const createUserResponse = await createUserWithEmailAndPassword(auth, email, password);
    res.json(createUserResponse.user);
  } catch(error) {
    if(error instanceof FirebaseError) {
      const status = getFirebaseErrorHttpStatusCode(error.code);
      return res.status(status).send(error.message);
    }

    if(error instanceof Error) {
      return res.status(500).send(error.message);
    }

    res.status(500).send("An unknown error occured during the user creation.");
  } finally {
    
    // Reset the flag after the process completes or fails
    // if (req.session) {
    //   req.session.createUserInProgress = false;
    // }
  }
});

export default router;
