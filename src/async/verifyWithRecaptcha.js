import axios from "axios";
import { RECAPTCHA_SITEKEY } from "../constants/constants";

export default function verifyWithRechaptcha(action) {
  let grecaptcha = window.grecaptcha;
  
  // REACAPTCHA DOCS:
  // https://developers.google.com/recaptcha/docs/loading?
  
  if(typeof grecaptcha === "undefined") {
    grecaptcha = {};
  }
  grecaptcha.ready = function(cb){
    if(typeof grecaptcha === "undefined") {
      
      // window.__grecaptcha_cfg is a global variable that stores reCAPTCHA"s
      // configuration. By default, any functions listed in its "fns" property
      // are automatically executed when reCAPTCHA loads.
      const c = "___grecaptcha_cfg";
      window[c] = window[c] || {};
      (window[c]["fns"] = window[c]["fns"]||[]).push(cb);
    } else {
      return cb();
    }
  }
  
  return grecaptcha.ready(function() {
    return grecaptcha.execute(RECAPTCHA_SITEKEY, { action })
    .then(async function(token) {
        const { data: success } = await axios(
          "/.netlify/functions/proxy/grecaptcha",
          {headers: { Authorization: `Bearer ${token}` }}
        );
        return success;
    })
  });
}
