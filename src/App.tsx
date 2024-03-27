import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch, useLocation } from "react-router-dom";
import { PaletteMode, ThemeProvider as MuiThemeProvider } from "@mui/material";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Statistics from "./pages/Statistics/Statistics";
import Login from "./components/Login/Login";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import { defaultTextDisplayFontStyle } from "./styles/textDisplayTheme/textDisplayData";
import { PlayPageThemeProvider } from "./styles/themeContexts";
import { createAppTheme } from "./styles/appTheme";
import { AllowedMistype, LatestResult, MistypedWordsLog, User } from "./types/otherTypes";
import CssBaseline from '@mui/material/CssBaseline';
import "simplebar/dist/simplebar.min.css";
import { LOCAL_STORAGE_KEYS } from "./constants/constants";
import { auth } from "./database/firebase";
import { getUser } from "./database/endpoints";
import handleError from "./helpFunctions/handleError";
import { onAuthStateChanged } from "firebase/auth";
import { addUserIdToStorageKey, extractUserFromDbUser, unminifyMistypedWordsLog } from "./appHelpFunctions";
import { FontData, FontStyle } from "./types/themeTypes";
import loadFont from "./async/loadFont";
import parseStorageItem from "./helpFunctions/parseStorageItem";
import Loading from "./components/Loading/Loading";

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
    return onAuthStateChanged(auth, async (providerUser) => {
      
      // Disable loading screen flag.
      if(!providerUser && isLoginPending) {
        setIsLoginPending(false);
      }
      
      // user logged in
      if (providerUser) {
        try {
          const loggedInUserDB = await getUser(providerUser.uid);
          console.log(`Logged in user name: ${loggedInUserDB?.n}.`);

          // Extract and save to the state mistyped words from the user object.
          if(loggedInUserDB?.m) {
            const minifiedMistypedWordsLog = JSON.parse(loggedInUserDB.m);
            const unminified = unminifyMistypedWordsLog(minifiedMistypedWordsLog);
            setSavedMistypedWords(unminified);
          }
          
          // Extract and save to the state latest results from the user object.
          if(loggedInUserDB?.r) {
            const latestResults = JSON.parse(loggedInUserDB.r);
            setLatestResults(latestResults);
          }

          // Extract and save to the state the user object.
          setUser(extractUserFromDbUser(loggedInUserDB));

          // Disable loading screen flag.
          if(isLoginPending) {
            setIsLoginPending(false);
          }

        } catch(error) {
          handleError(error);
        }

      // user logged out
      } else {
        setUser(null);
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
    const recaptchaNode = document.getElementsByClassName("grecaptcha-badge")?.[0] as HTMLElement;
    recaptchaNode.style.visibility = isRecaptchaBadgeVisible ? "visible" : "hidden";
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
              setUser={setUser}
              user={user}
              setIsRecaptchaBadgeVisible={setIsRecaptchaBadgeVisible} />
          </Route>
          <PrivateRoute path="/mainMenu" user={user}>
            <MainMenu
              setText={setText}
              fontData={fontData}
              setUser={setUser}
              user={user}
            />
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
};
