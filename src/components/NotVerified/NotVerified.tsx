import { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import sendVerificationEmail from "../../async/sendVerificationEmail";
import { auth } from "../../database/firebase";
import { Close as CloseIcon } from "@mui/icons-material";
import { RECAPTCHA_KEYS, RESEND_VERIFICATION_EMAIL } from "../../constants/constants";
import verifyWithRechaptcha from "../../async/verifyWithRecaptcha";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotVerified({ open, setOpen }: Props) {
  const [counter, setCounter] = useState(RESEND_VERIFICATION_EMAIL.DELAY);

  useEffect(() => {
    const timer = setInterval(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      } else {
        clearInterval(timer);
      }

    }, RESEND_VERIFICATION_EMAIL.INTERVAL);
    
    return () => {
      clearInterval(timer);
      if(!open) setCounter(RESEND_VERIFICATION_EMAIL.DELAY);
    }
  }, [counter, open]);

  const handleClick = async () => {
    const { currentUser } = auth;

    if (!currentUser) {
      console.log("You're not logged in.");
      return;
    }

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
    try {
      await sendVerificationEmail(currentUser);
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          elevation={3}
          sx={{ position: "relative", width: "40rem", p: "2rem", textAlign: "center", mx: "auto", marginTop: "20vh" }}
        >
          <IconButton
            sx={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}
            aria-label="close"
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ marginBottom: "2rem" }}
          >
            Neaktivovaný účet
          </Typography>
          <Typography>Váš uživatelský účet nebyl dosud aktivován. Pro dokončení aktivace si prosím zkontrolujte Vaši e-mailovou schránku, včetně spamu.</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center", textAlign: "right", mt: "1.5rem" }}>
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
        </Paper>
      </Modal>
    </Box>
  );
}
