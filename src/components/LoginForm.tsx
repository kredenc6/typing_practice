import { Button, Box, Link, TextField, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { googleProvider } from "../database/firebase";
import { type AuthProvider } from "firebase/auth";

interface Props {
  createAccount: (value: true) => void;
  rememberTheUser: boolean;
  handleCheckboxChange: () => void;
  login: (provider: AuthProvider) => void;
}

export default function LoginForm({
  createAccount, rememberTheUser, handleCheckboxChange, login
}: Props) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ marginBottom: "2rem" }}
      >
        Přihlášení
      </Typography>
      <Box component="form" sx={{ mb: "1.5rem", display: "flex", flexWrap: "wrap", justifyItems: "center" }}>
        <TextField  sx={{ width: "100%", mb: "0.5rem" }} required id="login-email" label="email" type="email" size="small" />
        <TextField sx={{ width: "100%", mb: "0.5rem" }}  required id="login-password" label="heslo" type="password" size="small" />
        <Box sx={{ width: "100%", textAlign: "right", mb: "0.5rem" }}>
          <Link href="#">Zamponěl(a) jsem heslo</Link>
        </Box>
        <Button sx={{ width: "100%", mb: "0.5rem" }}  variant="contained">Přihlásit se</Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", mb: "1rem" }}>
        <Button
          onClick={() => login(googleProvider)}
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
