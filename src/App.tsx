import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import { defaultTextDisplayFontData } from "./styles/textDisplayTheme/textDisplayData";
import { FontData } from "./types/themeTypes";
import { Row } from "./types/symbolTypes";
import { ThemeContext } from "./styles/themeContext";
import { createUpdatedAppTheme } from "./styles/appTheme";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayFontData);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const [text, setText] = useState("");
  const [mistypedWords, setMistypedWords] = useState<Row["words"]>([]);
  const { state: theme } = useContext(ThemeContext);
  const [allowedMistypeCount, setAllowedMisttypeCount] = useState(3);
  // const [theme, setTheme] = useState(appTheme)
  // const [mistypedSymbols, setMistypedSymbols] = useState<string[]>([]);

  const timer = useRef(new Timer());

  const handleFontDataChange = async (fieldToUpdate: Partial<FontData>, callback?: () => any) => {
    const updatedFields = Object.keys(fieldToUpdate) as (keyof FontData)[];
    const { fontFamily, fontSize } = { ...fontData, ...fieldToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);

    if(!newFontData) return;
    setIsFontDataLoading(true);
    
    if(updatedFields.includes("fontSize")) {
      const updatedTextDisplayTheme = { ...theme.textDisplayTheme };
      const updatedSidePadding = fontSize;
      updatedTextDisplayTheme.offset.display.paddingRight = updatedSidePadding;
      updatedTextDisplayTheme.offset.display.paddingLeft = updatedSidePadding;
      createUpdatedAppTheme({ textDisplayTheme: updatedTextDisplayTheme });
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
      return;
    }

    setFontData(newFontData);
  };

  useEffect(() => {
    const { fontFamily, fontSize } = fontData;
    getFontData(fontFamily, fontSize)
      .then(newFontData => {
        if(!newFontData) return;
        handleFontDataChange(newFontData);
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(mistypedWords.length) {
      const time = timer.current.getTime();
      // const wordCount = symbolRows.reduce((wordCount, { words }) => wordCount + words.length, 0);
      console.log(`Time: ${time}s`);
      // console.log(`Typing speed:
      //   ${calcTypingSpeed(time, text.length - mistypedSymbols.length)} chars/minute`);
      console.log("You've reached the end of the text.");
      // console.log(mistypedWords);
      // console.log(mistypedSymbols);
      console.log(mistypedWords);
    }
  }, [mistypedWords, timer])

  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/mainMenu" />
          </Route>
          <Route path="/mainMenu">
            <MainMenu setText={setText} text={text} />
          </Route>
          <Route path="/playArea">
            <PlayPage
              fontData={fontData}
              handleFontDataChange={handleFontDataChange}
              isFontDataLoading={isFontDataLoading}
              setMistypedWords={setMistypedWords}
              text={text}
              timer={timer.current}
              allowedMistypeCount={allowedMistypeCount} />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

// TODO add sounds like in www.typingclub.com
// TODO way to handle mistakes:
//  - stop at the current character and wait till the current one is pressed
//  - continue to the next character
//  - allow backspace
// TODO add $nbsp; after prepositions

// TODO handle failed font fetch

// TODO make links and comments for used sources like wiki and osel(here I should probably ask for permision)
