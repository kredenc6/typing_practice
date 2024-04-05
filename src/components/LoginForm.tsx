import { Button, Box, Link, TextField, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { loginWithEmail, loginWithProvider } from "../async/loginUser";
import { googleProvider } from "../database/firebase";
import * as yup from "yup";
import { useFormik } from "formik";

interface Props {
  createAccount: (value: true) => void;
  rememberTheUser: boolean;
  handleCheckboxChange: () => void;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Zadejte platný email")
    .required("Email je vyžadován"),
  password: yup
    .string()
    .required("Heslo je vyžadováno"),
});

export default function LoginForm({
  createAccount, rememberTheUser, handleCheckboxChange
}: Props) {
  const {
    handleBlur, handleChange, handleSubmit,
    values: { email, password }, ...formik
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async ({ email, password }) => {
      try {
        await loginWithEmail(email, password);
      } catch(error) {
        if(error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("An unknown error has occured during user login.");
        }
      }
    }
  });

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ marginBottom: "2rem" }}
      >
        Přihlášení
      </Typography>
      <Box
        component="form"
        sx={{ mb: "1.5rem", display: "flex", flexWrap: "wrap", justifyItems: "center" }}
        onSubmit={handleSubmit}  
      >
        <TextField 
          sx={{ width: "100%", mb: "0.5rem" }}
          required
          id="email"
          label="email"
          type="email"
          size="small"
          value={email}
          onBlur={handleBlur}
          onChange={handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email} />
        <TextField
          sx={{ width: "100%", mb: "0.5rem" }}
          required
          id="password"
          label="heslo"
          type="password"
          size="small"
          value={password}
          onBlur={handleBlur}
          onChange={handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password} />
        <Box sx={{ width: "100%", textAlign: "right", mb: "0.5rem" }}>
          <Link href="#">Zamponěl(a) jsem heslo</Link>
        </Box>
        <Button
          sx={{ width: "100%", mb: "0.5rem" }}
          variant="contained"
          type="submit"
        >
          Přihlásit se
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: "1rem" }}>
        <Button
          onClick={loginWithGoogle}
          variant="contained"
        >
          Přihlásit se přes Google
        </Button>
        <FormControlLabel
          control={<Checkbox checked={rememberTheUser} onChange={handleCheckboxChange} />}
          label="Zůstat přihlášen(a)"
        />
      </Box>
      <Link href="#" onClick={() => createAccount(true)}>Ještě nemáte účet? Vytvořte si ho zde.</Link>
    </Box>
  );
}

async function loginWithGoogle() {
  
  // The login logic is handled by the onAuthState listener in the App.tsx
  try {
    await loginWithProvider(googleProvider);
  } catch(error) {
    if(error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("An unknown error has occured during user login.");
    }
  }
}
