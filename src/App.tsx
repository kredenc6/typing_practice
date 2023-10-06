import { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, RouteProps, Switch, useLocation } from "react-router-dom";
import { PaletteMode, ThemeProvider as MuiThemeProvider } from "@mui/material";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Statistics from "./pages/Statistics/Statistics";
import Login from "./components/Login/Login";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import { defaultTextDisplayFontData } from "./styles/textDisplayTheme/textDisplayData";
import { FontData } from "./types/themeTypes";
import { PlayPageThemeContext, PlayPageThemeProvider } from "./styles/themeContexts";
import { createAppTheme } from "./styles/appTheme";
import { AllowedMistype, LatestResult, MistypedWordsLog, User } from "./types/otherTypes";
import { getKnownSymbols } from "./helpFunctions/getKnownSymbols";
import CssBaseline from '@mui/material/CssBaseline';
import "simplebar/dist/simplebar.min.css";
import { LOCAL_STORAGE_KEYS } from "./constants/constants";
import { auth } from "./database/firebase";
import { getUser } from "./database/endpoints";
import handleError from "./helpFunctions/handleError";
import { onAuthStateChanged } from "firebase/auth";
import { extractUserFromDbUser, unminifyMistypedWordsLog } from "./appHelpFunctions";
import checkStringSize from "./helpFunctions/checkStringSize";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayFontData);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const [text, setText] = useState("");
  const [appTheme, setAppTheme] = useState(createAppTheme());
  const { state: playPageTheme, update: updatePlayPageTheme } = useContext(PlayPageThemeContext);
  const [allowedMistype, setAllowedMistype] = useState<AllowedMistype>({
    count: 1, isAllowed: true
  });
  const [user, setUser] = useState<User | null>(null);
  // TODO rename to just mistypedWords?
  const [savedMistypedWords, setSavedMistypedWords] = useState<MistypedWordsLog | null>(null);
  const [latestResults, setLatestResults] = useState<LatestResult[] | null>(null);

  const updateTheme = useCallback((themeType: PaletteMode) => {
    setAppTheme(createAppTheme(themeType)) ;
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME_TYPES, themeType);
  }, []);

  const timer = useRef(new Timer());

  const handleFontDataChange = async (fieldToUpdate: Partial<FontData>, callback?: () => any) => {
    const updatedFields = Object.keys(fieldToUpdate) as (keyof FontData)[];
    const { fontFamily, fontSize } = { ...fontData, ...fieldToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);

    if(!newFontData) return;
    setIsFontDataLoading(true);
    
    if(updatedFields.includes("fontSize")) {
      const updatedTextDisplayTheme = { ...playPageTheme };
      const updatedSidePadding = fontSize;
      updatedTextDisplayTheme.offset.display.paddingRight = updatedSidePadding;
      updatedTextDisplayTheme.offset.display.paddingLeft = updatedSidePadding;
      updatePlayPageTheme(updatedTextDisplayTheme);
      callback && callback();
      setIsFontDataLoading(false);
    }
    
    if(updatedFields.includes("fontFamily")) {
      if(newFontData.fontLocation === "local") {
        setFontData(newFontData);
        callback && callback();
        setIsFontDataLoading(false);
      } else {
        loadFont(newFontData, setFontData, () => {
          callback && callback();
          setIsFontDataLoading(false);
        });
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.FONT_DATA, JSON.stringify(newFontData));
      return;
    }
    
    setFontData(newFontData);
    localStorage.setItem(LOCAL_STORAGE_KEYS.FONT_DATA, JSON.stringify(newFontData));
  };


  // TODO make it custom and seperate it to several by their functionality
  useEffect(() => {
    const localFontData = localStorage.getItem(LOCAL_STORAGE_KEYS.FONT_DATA);
    const determinedFontData = localFontData ? JSON.parse(localFontData) as FontData : fontData;
    const { fontFamily, fontSize } = determinedFontData;
    getFontData(fontFamily, fontSize)
      .then(newFontData => {
        if(!newFontData) return;
        handleFontDataChange(newFontData);
      });
    const loadedMistypeSetting = localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPE_SETTINGS);
    if(loadedMistypeSetting) {
      setAllowedMistype(JSON.parse(loadedMistypeSetting) as AllowedMistype);
    }

    // AUTH STATE CHANGE LISTENER
    return onAuthStateChanged(auth, async (providerUser) => {
      console.log(`Auth state changed. Current user: `, auth.currentUser?.uid);
      console.dir(providerUser)
      
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

  return (
    <MuiThemeProvider theme={{ ...appTheme, updateTheme }}>
      <CssBaseline /> {/* will also enable dark mode for the app's background. */}
      <Router>
        <Switch>
          <PrivateRoute exact path="/" user={user}>
            <Redirect to="/mainMenu" />
          </PrivateRoute>
          <Route path="/login">
            <Login setUser={setUser} user={user} />
          </Route>
          <PrivateRoute path="/mainMenu" user={user}>
            <MainMenu
              setText={setText}
              knownSymbols={getKnownSymbols(fontData)}
              setUser={setUser}
              user={user}
            />
          </PrivateRoute>
          <PrivateRoute path="/playArea" user={user}>
            <PlayPageThemeProvider>
              <PlayPage
                fontData={fontData}
                handleFontDataChange={handleFontDataChange}
                isFontDataLoading={isFontDataLoading}
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
  );
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

// TODO add typing sounds
// TODO add $nbsp; after prepositions
// TODO create a text difficulty assesment function
//  - at first it can be based on symbol difficulty, later on on the symbol combination
//  - and finally both?

// TODO implement notifications - for errors to start with
// TODO handle failed font fetch
// TODO be able to save a text and load it
// TODO limit a text to 10000? symbols

// TODO make links and comments for used sources like wiki and osel(here I should probably ask for permision)
// TODO display url of the loaded article
// TODO for performance - I could split the text to the visible part and make a symbol...
// ...row object just from that. The rest of the symbol row object would be stored and...
// ...updated(on the row change?) separately from the render function

// TODO  add descriptions to main menu text adjustments
// TODO add text adjustment for czech and english keyboard
// TODO style scrollbar along with  theme
// TODO save sorting selection(in statistics) permanently
// TODO set a maximum count for mistyped words (10000?)
// TODO replace initial states(like empty string, array or object) with null where suitable
// TODO minify resultObj which is saved/loaded from LS or DB
// TODO move allowedMistype, setAllowedMistype state to PlayPage (if possible)
// TODO add spinner when loading text from the internet
// TODO add keyboard icon to browser tab
// TODO scrollbars are almost invisible in dark mode (especially in the loaded paragraph tooltips)
// TODO retry text loading when received empty paragraphs from random wiki
// TODO remember text input when going from main menu to statistics (and play page?)
// TODO disable statistics button in MainMenu when there are no results yet
// TODO add small delete button for deleting all text in the text field
// BUG in mistyped words counter shows for example 1-7/10 (when not enough words)
// TODO make tooltip disappear when scrolling and the tooltip arrow is leaving the paragraph window
// TODO user can set up a typing profile (for example for different keyboards, or devices)
// TODO use new Intl.Collator("cz").compare(wordA, wordB) instead of the wordA.localCompare(wordB, "cz") - it's more precise
// TODO get rid of the Login page flashing when auto-loging
// TODO improve fetching experience and handling (multiple quick calls, errors, etc.) - there should be libraries for this, do some research

// DATABASE:
// BUG signOut() can fail - it returns a promise, which should be handled
// TODO write database security rules: https://firebase.google.com/docs/rules/basics?authuser=0
// TODO mistype timestamps can be reduced to minutes (4-byte integer: Math.trunc(Date.now() / 60000)), however...
// ...this is expensive, so the best way would be to store raw results from this day in the local storage and...
// ... once the user logins the next day it would automatically update the DB with optimized and compressed data...
// ...and deleted the previous day results

// NETLIFY
// BUG netlify lambda functions can crush the running server (getting articles is the cause?) - needs more investigation to find out the cause

// TODO handling sync with the firebase
/* Using onbeforeunload listener works only if it triggers the "alert" (the callback must return a string to do that).
Syncing 1x a day doesn't work if the user uses multiple devices for example in a school. Some results would never be synced.
There could be a complicated solution for this - manual sync done by the user and alerting him, when no sync was done
and the broswer is closing. There would also needed to be some FUP in place. It would be increased in a payed version.
The last option leaves me with the sync every time the transcript is done. */

// TODO saves to the local storage need to be bound to the user
// TODO don't save results under 100 (200?) characters