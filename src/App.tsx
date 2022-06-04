import { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Statistics from "./pages/Statistics/Statistics";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import { defaultTextDisplayFontData } from "./styles/textDisplayTheme/textDisplayData";
import { FontData, ThemeType } from "./types/themeTypes";
import { PlayPageThemeContext, PlayPageThemeProvider } from "./styles/themeContexts";
import { createAppTheme } from "./styles/appTheme";
import { AllowedMistype } from "./types/otherTypes";
import { getKnownSymbols } from "./helpFunctions/getKnownSymbols";
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
    <MuiThemeProvider
      theme={{
        ...appTheme,
        updateTheme: (themeType: ThemeType) => {
          setAppTheme(createAppTheme(themeType)) ;
          localStorage.setItem(LOCAL_STORAGE_KEYS.THEME_TYPES, themeType);
        }
      }}
    >
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

// BUG last mistype is not registered when quickly enough backspace(production should be fast enough?)
//  - it should wait with finish when the last symbol is mistyped?
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
// BUG word times are most likely incorect when the word is "backspaced"
// TODO for performance - I could split the text to the visible part and make a symbol...
// ...row object just from that. The rest of the symbol row object would be stored and...
// ...updated(on the row change?) separately from the render function
// BUG in playArea menu button are selectable - if some of them stays active it de/pops the menu on spacebar (annoying during typing)

// TODO  add descriptions to main menu text adjustments
// TODO add text adjustment for czech and english keyboard
// TODO blue color in dark theme is poorly readable
// TODO style scrollbar along with  theme
// TODO save sorting selection(in statistics) permanently
