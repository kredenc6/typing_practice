import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { PaletteMode, ThemeProvider as MuiThemeProvider } from "@mui/material";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Statistics from "./pages/Statistics/Statistics";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import { defaultTextDisplayFontData } from "./styles/textDisplayTheme/textDisplayData";
import { FontData } from "./types/themeTypes";
import { PlayPageThemeContext, PlayPageThemeProvider } from "./styles/themeContexts";
import { createAppTheme } from "./styles/appTheme";
import { AllowedMistype } from "./types/otherTypes";
import { getKnownSymbols } from "./helpFunctions/getKnownSymbols";
import CssBaseline from '@mui/material/CssBaseline';
import "simplebar/dist/simplebar.min.css";
import { LOCAL_STORAGE_KEYS } from "./constants/constants";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayFontData);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const [text, setText] = useState("");
  const [appTheme, setAppTheme] = useState(createAppTheme());
  const { state: playPageTheme, update: updatePlayPageTheme } = useContext(PlayPageThemeContext);
  const [allowedMistype, setAllowedMistype] = useState<AllowedMistype>({
    count: 1, isAllowed: true
  });

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MuiThemeProvider theme={{ ...appTheme, updateTheme }}>
      <CssBaseline /> {/* will also enable dark mode for the app's background. */}
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/mainMenu" />
          </Route>
          <Route path="/mainMenu">
            <MainMenu setText={setText} knownSymbols={getKnownSymbols(fontData)} />
          </Route>
          <Route path="/playArea">
            <PlayPageThemeProvider>
              <PlayPage
                fontData={fontData}
                handleFontDataChange={handleFontDataChange}
                isFontDataLoading={isFontDataLoading}
                text={text}
                timer={timer.current}
                setAllowedMistype={setAllowedMistype}
                allowedMistype={allowedMistype} />
            </PlayPageThemeProvider>
          </Route>
          <Route path="/statistics">
            <Statistics />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

// TODO save last 3 mistype(finish) results in the json
// TODO add typing sounds
// TODO add $nbsp; after prepositions
// TODO create a text difficulty assesment function
//  - at first it can be based on symbol difficulty, later on on the symbol combination
//  - and finally both?

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

