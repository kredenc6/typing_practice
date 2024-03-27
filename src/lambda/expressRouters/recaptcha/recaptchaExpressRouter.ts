import express from "express";
import { ExtendedRequest } from "../../functions/proxy";
import axios from "axios";
import { RECAPTCHA_SECRET } from "../../../constants/secretConstants";

const router = express.Router();

router.get("/grecaptcha", (req: ExtendedRequest, res) => {
  const token = req.token;

  if(!token) {
    return res.status(500).send(`Recieved non-string verification token: ${token}.`);
  }

  axios({
    method: "POST",
    responseType: "json",
    url: "https://www.google.com/recaptcha/api/siteverify",
    params: {
      secret: RECAPTCHA_SECRET,
      response: token
    }
  })
    .then(({ data }) => {
      res.send(data.success);
    })
    .catch(err => res.status(500).send(err.message));
});

export default router;
