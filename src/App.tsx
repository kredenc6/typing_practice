import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, type RouteProps, Switch, useLocation } from "react-router-dom";
import { type PaletteMode, ThemeProvider as MuiThemeProvider } from "@mui/material";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Statistics from "./pages/Statistics/Statistics";
import Login from "./components/Login/Login";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import { defaultTextDisplayFontStyle } from "./styles/textDisplayTheme/textDisplayData";
import { PlayPageThemeProvider } from "./styles/themeContexts";
import { createAppTheme } from "./styles/appTheme";
import { type AllowedMistype, type LatestResult, type MistypedWordsLog, type User } from "./types/otherTypes";
import CssBaseline from '@mui/material/CssBaseline';
import "simplebar/dist/simplebar.min.css";
import { ALLOWED_PROVIDER_IDS, LOCAL_STORAGE_KEYS } from "./constants/constants";
import { auth } from "./database/firebase";
import { getUser, isUserInDB, saveUser } from "./database/endpoints";
import handleError from "./helpFunctions/handleError";
import { onAuthStateChanged } from "firebase/auth";
import { addUserIdToStorageKey, formatToUserDBFromUser, formatToUserFromDbUser, unminifyMistypedWordsLog } from "./appHelpFunctions";
import { type FontData, type FontStyle } from "./types/themeTypes";
import loadFont from "./async/loadFont";
import parseStorageItem from "./helpFunctions/parseStorageItem";
import Loading from "./components/Loading/Loading";
import createNewUser from "./helpFunctions/createNewDbUser";

export default function App() {
  const [fontData, setFontData] = useState<FontData | null>(null);
  const [text, setText] = useState("");
  const [appTheme, setAppTheme] = useState(createAppTheme(null));
  const [allowedMistype, setAllowedMistype] = useState<AllowedMistype>({
    count: 1, isAllowed: true
  });
  const [user, setUser] = useState<User | null>(null);
  // TODO rename to just mistypedWords?
  const [savedMistypedWords, setSavedMistypedWords] = useState<MistypedWordsLog | null>(null);
  const [latestResults, setLatestResults] = useState<LatestResult[] | null>(null);
  const [isLoginPending, setIsLoginPending] = useState(true);
  const [isRecaptchaBadgeVisible, setIsRecaptchaBadgeVisible] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const updateTheme = useCallback((themeType?: PaletteMode) => {
    if(!user?.id) return;

    // Update the App theme.
    const newAppTheme = createAppTheme(user.id, themeType);
    setAppTheme(newAppTheme) ;

    // Update the local storage.
    const key = addUserIdToStorageKey(user.id, LOCAL_STORAGE_KEYS.THEME_TYPES);
    const newAppThemeType = newAppTheme.palette.mode;
    localStorage.setItem(key, newAppThemeType);
  }, [user]);

  const timer = useRef(new Timer());

  // TODO make it custom and seperate it to several by their functionality
  useEffect(() => {
    // AUTH STATE CHANGE LISTENER
    return onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("sdlkfj klsd fljk ls lsedklf jl")
      // User logged in.
      if (firebaseUser) {

        // User doesn't have a verified email.
        if(!firebaseUser.emailVerified) {
          console.log(`Unverified email ${firebaseUser.email}. Pausing the login attempt.`);
          return;
        }

        // User is verified.
        try {

          // When the user is in the database:
          if(await isUserInDB(firebaseUser.uid)) {
            const loggedInUserDB = await getUser(firebaseUser.uid);
            console.log(`Logged in user name: ${loggedInUserDB.n}.`);
  
            // Extract and save to the state mistyped words from the user object.
            if(loggedInUserDB.m) {
              const minifiedMistypedWordsLog = JSON.parse(loggedInUserDB.m);
              const unminified = unminifyMistypedWordsLog(minifiedMistypedWordsLog);
              setSavedMistypedWords(unminified);
            }
            
            // Extract and save to the state latest results from the user object.
            if(loggedInUserDB.r) {
              const latestResults = JSON.parse(loggedInUserDB.r);
              setLatestResults(latestResults);
            }
  
            // Extract and save to the state the user object.
            setUser(formatToUserFromDbUser(loggedInUserDB));

          // When the user is not in the database:
          } else {

            // The logic works when the length === 1. It should correspond to the 1 provider linked to the 1 account.
            // In this case Google. If it's bigger find out why. There's a possibility to link multiple providers
            // to the one account. The logic here does no account for that.
            if(firebaseUser.providerData.length !== 1) {
              throw new Error("Invalid provider count.");
            }

            const providerId = firebaseUser.providerData[0].providerId;
            if(!ALLOWED_PROVIDER_IDS.includes(providerId)) {
              auth.signOut()
                .catch(error => {
                  const errorMsg = "Failed to log out.";
                  handleError(error, errorMsg);
                });

              throw new Error(`Not allowed provider id: ${providerId}`);
            }
            
            try {
              // Create a new DB user.
              const newUser = createNewUser(firebaseUser);
        
              // Save the new user to the database and the state.
              const newUserDB = formatToUserDBFromUser(newUser);
              await saveUser(firebaseUser.uid, newUserDB);
              setUser(newUser);
            }
            catch(error) {
              const errorMessage = "Failed to save the user to the database";
              handleError(error, errorMessage);
            }
          }

          // Disable loading screen flag.
          if(isLoginPending) {
            setIsLoginPending(false);
          }

        } catch(error) {
          handleError(error);
        }

      // User logged out.
      } else {
        setUser(null);
        setSavedMistypedWords(null);
        setLatestResults(null);

        // Disable loading screen flag.
        setIsLoginPending(false);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(!user) return;

    // Get user's font style or use default one.
    const {fontFamily, fontSize} = parseStorageItem<FontStyle>(
      addUserIdToStorageKey(user.id, LOCAL_STORAGE_KEYS.FONT_DATA)
    ) ?? defaultTextDisplayFontStyle;

    getFontData(fontFamily, fontSize)
      .then(newFontData => {
        
        // load font
        if(newFontData.fontLocation === "local") {
          setFontData(newFontData);
        } else {
          // TODO handle failed load
          loadFont(newFontData, () => {
            setFontData(newFontData);
          });
        }
      })
  },[user])

  useEffect(() => {
    updateTheme();
  }, [updateTheme])

  // set visibility for reCAPTCHA badge
  useEffect(() => {
    const recaptchaNode = document.getElementsByClassName("grecaptcha-badge")?.[0] as HTMLElement | null;

    if(recaptchaNode) {
      recaptchaNode.style.visibility = isRecaptchaBadgeVisible ? "visible" : "hidden";
    }
  }, [isRecaptchaBadgeVisible])

  return (
    isLoginPending
      ? <Loading />
      : (
    <MuiThemeProvider theme={{ ...appTheme, updateTheme }}>
      <CssBaseline /> {/* will also enable dark mode for the app's background. */}
      <Router>
        <Switch>
          <PrivateRoute exact path="/" user={user}>
            <Redirect to="/mainMenu" />
          </PrivateRoute>
          <Route path="/login">
            <Login
              user={user}
              openModal={openModal}
              setOpenModal={setOpenModal}
              setIsRecaptchaBadgeVisible={setIsRecaptchaBadgeVisible} />
          </Route>
          <PrivateRoute path="/mainMenu" user={user}>
            <MainMenu
              setText={setText}
              fontData={fontData}
              setUser={setUser}
              user={user} />
          </PrivateRoute>
          <PrivateRoute path="/playArea" user={user}>
            <PlayPageThemeProvider userId={user?.id ?? null}>
              <PlayPage
                fontData={fontData!}
                setFontData={setFontData}
                text={text}
                timer={timer.current}
                setAllowedMistype={setAllowedMistype}
                allowedMistype={allowedMistype}
                userId={user?.id ?? null}
                savedMistypedWords={savedMistypedWords}
                setSavedMistypedWords={setSavedMistypedWords}
                latestResults={latestResults}
                setLatestResults={setLatestResults} />
            </PlayPageThemeProvider>
          </PrivateRoute>
          <PrivateRoute path="/statistics" user={user}>
            <Statistics savedMistypedWords={savedMistypedWords} latestResults={latestResults} />
          </PrivateRoute>
        </Switch>
      </Router>
    </MuiThemeProvider>
  ));
}

interface PrivateRouteProps {
  children: ReactNode;
  user: User | null;
}


// TODO this can be a nice generic component!!
/**
 * allows logged in user only
 */
function PrivateRoute({ children, user, ...routeProps }:PrivateRouteProps & RouteProps) {
  const location = useLocation();

  return (
    <Route
      {...routeProps}
      render={() => {
        if (!user) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          );
        }

        return children;
      }}
    />
  );
}
