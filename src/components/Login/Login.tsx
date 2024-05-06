import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { browserLocalPersistence, inMemoryPersistence } from "firebase/auth";
import { auth } from "../../database/firebase";
import { Box, Paper, Typography } from "@mui/material";
import { type User } from "../../types/otherTypes";
import LoginForm from "../LoginForm";
import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import NotVerified from "../NotVerified/NotVerified";

interface Props {
  user: User | null;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRecaptchaBadgeVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login({
  user, openModal, setOpenModal, setIsRecaptchaBadgeVisible
}: Props) {
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
        const test = auth as any; // TODO wtf is this?
        console.log(`persistence type: ${test.persistenceManager.persistence.type}`);
      });
  };

  useEffect(() => {
    console.log(`user in login page: ${user?.id}`);
    if(!user) {
      auth.setPersistence(inMemoryPersistence)
        .then(() => {
          const test = auth as any;
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
                  setOpenModal={setOpenModal} />
            }
          </Paper>
          <NotVerified open={openModal} setOpen={setOpenModal}/>
        </Box>
        )
    );
}
