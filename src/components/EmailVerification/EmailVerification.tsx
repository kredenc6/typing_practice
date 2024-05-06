import { Box, Button, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import sendVerificationEmail from "../../async/sendVerificationEmail";
import { auth } from "../../database/firebase";
import { RECAPTCHA_KEYS, RESEND_VERIFICATION_EMAIL } from "../../constants/constants";
import verifyWithRechaptcha from "../../async/verifyWithRecaptcha";

interface Props {
  createAccount: (value: false) => void;
}

export default function EmailVerification({ createAccount }: Props) {
  const [counter, setCounter] = useState(RESEND_VERIFICATION_EMAIL.DELAY);

  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        clearInterval(timer);
      }
    }, RESEND_VERIFICATION_EMAIL.INTERVAL);

    return () => clearInterval(timer);
  }, [counter]);

  const handleClick = async () => {
    setCounter(RESEND_VERIFICATION_EMAIL.DELAY);
    
    // Verify with reCHAPTCHA.
    try {
      const recaptchaResult = await verifyWithRechaptcha(RECAPTCHA_KEYS.EMAIL_AUTH);
      
      if(recaptchaResult === false) {
        const errorMessage = "Resending the authentication email was blocked by reCAPTCHA.";
        console.log(errorMessage);
        return;
      }
    } catch(error) {
      if(error instanceof Error) {
        console.log(error.message);
        return;
      }
    }

    // Resend the activation email.
    if(!auth.currentUser) {
      console.log("Firebase user is not logged in. Can't send the verification email.");
      return;
    }

    try {
      await sendVerificationEmail(auth.currentUser);
      console.log(`Ověřovací email byl odeslán na ${auth.currentUser?.email}`);
    } catch(error) {
      if(error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error has occured when resending verification email.");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
        Aktivace účtu
      </Typography>
      <Box
        sx={{ display: "flex", mb: "1rem", flexWrap: "no-wrap", justifyContent: "center" }}
      >
        <Typography>
          Gratulujeme! Váš účet byl vytvořen. Pro jeho aktivaci, prosím, přejděte na odkaz v emailu, který Vám byl zaslán.
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", textAlign: "right", my: "1.5rem" }}>
        <Typography sx={{ width: "100%" }}>
          Žádný aktivační email nepřišel?
        </Typography>
        <Button
          sx={{ width: "8rem" }}
          variant="contained"
          size="small"
          disabled={counter !== 0}
          onClick={handleClick}
        >
          {counter
            ? <Typography sx={{ textTransform: "lowercase" }}>{counter}s</Typography>
            : "Zaslat znovu"
          }
        </Button>
      </Box>
      <Link href="#" onClick={() => createAccount(false)}>Zpět na přihlášení.</Link>
    </Box>
  );
}
