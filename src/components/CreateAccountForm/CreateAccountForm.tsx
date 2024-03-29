import { Box, Button, Link, TextField, Typography, useTheme } from "@mui/material";
import * as yup from "yup";
import { ErrorMessage, useFormik } from "formik";
import verifyWithRechaptcha from "../../async/verifyWithRecaptcha";
import { useState } from "react";
import { ScaleLoader } from "react-spinners";
import scaleCssLength from "../../helpFunctions/scaleCssLength";
import { BUTTON_SPINNER_SIZE_COEFICIENT } from "../../constants/constants";
import createUser from "../../async/createUser";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Zadejte platný email")
    .required("Email je vyžadován"),
  password: yup
    .string()
    .min(8, "Příliš krátké")
    .max(20, "Příliš dlouhé")
    .required("Heslo je vyžadováno"),
  verification: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Hesla se neshodují")
    .required("Heslo znovu je vyžadováno")
});

interface Props {
  createAccount: (value: false) => void;
}

// TODO disable the fields and the button when waiting for a response
// TODO invalidate the email field when the email is already in use (response will say that)
// a session storage might be good to remember that

export default function CreateAccountForm({ createAccount }: Props) {
  const { palette, typography } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const {
    handleBlur, handleChange, handleSubmit,
    values: { email, password, verification }, ...formik
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      verification: ""
    },
    validationSchema: validationSchema,

    // TODO implement user messaging
    onSubmit: async ({ email, password, verification }) => {
      // TODO for testing delete after
      // createUser(email, password, verification);
      // createUser(email, password, verification);

      if(error) {
        setError(null);
      }

      setIsLoading(true);

      // verify with reCHAPTCHA
      try {
        const recaptchaResult = await verifyWithRechaptcha("signIn");
        
        if(recaptchaResult === false) {
          const errorMessage = "Signing in was blocked by reCAPTCHA.";
          console.log(ErrorMessage);
          setError(new Error(errorMessage));
          setIsLoading(false);
          return;
        }
      } catch(error) {
        if(error instanceof Error) {
          console.log(error.message);
          setError(error);
          setIsLoading(false);
          return;
        }
      }

      // create user
      try {
        const { data } = await createUser(email, password, verification);
        console.log(`The user with the email address ${data.email} was created successfuly. Now try to log in.`);

        // Return user to the login page.
        createAccount(false);
      } catch(error) {
        if(error instanceof Error) {
          const errorMessage = `Failed to create the user, because: ${error.message}`;
          console.log(errorMessage);
          setError(new Error(errorMessage));
          setIsLoading(false);
          return;
        }
      }
    }
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
        Vytvoření účtu
      </Typography>
      <Box
        component="form"
        sx={{ display: "flex", mb: "1rem", flexWrap: "no-wrap", justifyContent: "center" }}
        onSubmit={handleSubmit}
      >
        <Box sx={{ width: "50%" }}>
          <TextField
            sx={{ width: "100%", mb: "0.5rem" }}
            disabled={isLoading}
            size="small"
            id="email"
            name="email"
            label="Email"
            value={email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email} />
          <TextField
            sx={{ width: "100%", mb: "0.5rem" }}
            disabled={isLoading}
            size="small"
            id="password"
            name="password"
            label="heslo"
            type="password"
            value={password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password} />
          <TextField
            sx={{ width: "100%", mb: "0.5rem" }}
            disabled={isLoading}
            size="small"
            id="verification"
            name="verification"
            label="heslo znovu"
            type="password"
            value={verification}
            onChange={handleChange}
            onBlur={handleBlur}
            error={formik.touched.verification && Boolean(formik.errors.verification)}
            helperText={formik.touched.verification && formik.errors.verification} />
          <Button
            sx={{ width: "100%", justifySelf: "flex-end", alignSelf: "end" }}
            disabled={isLoading}
            variant="contained"
            type="submit"
          >
            {!isLoading
              ? "Vytvořit účet"
              : <ScaleLoader
                  height={scaleCssLength(typography.button.fontSize as string, BUTTON_SPINNER_SIZE_COEFICIENT)}
                  color={palette.info.main}
                  aria-label="SignIn Spinner" />
            }
          </Button>
        </Box>
      </Box>
      <Link href="#" onClick={() => createAccount(false)}>Účet mám již vytvořený.</Link>
    </Box>
  );
}
