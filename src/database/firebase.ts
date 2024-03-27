// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_BlLd4oiZbOch4CGOkJM5hRMpIuzMbkc",
  authDomain: "typing-practice-399508.firebaseapp.com",
  projectId: "typing-practice-399508",
  storageBucket: "typing-practice-399508.appspot.com",
  messagingSenderId: "1010945517373",
  appId: "1:1010945517373:web:7818d9d75e2a00b5370754",
  measurementId: "G-BRZ3L2G181"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// // Pass your reCAPTCHA v3 site key (public key) to activate(). Make sure this
// // key is the counterpart to the secret key you set in the Firebase console.
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6Lf7TYspAAAAAKkNDi6tKnh7mqmn-RgrpKHKsbk6"),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });

export const auth = getAuth(app);
auth.useDeviceLanguage();
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
