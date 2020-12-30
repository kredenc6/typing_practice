import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Timer from "./accessories/Timer";
import { Row } from "./textFunctions/transformTextToSymbolRows";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import transformPixelSizeToNumber from "./helpFunctions/transformPixelSizeToNumber";
import appTheme from "./styles/appTheme";
import { defaultTextDisplayFontData, defaultTheme } from "./styles/textDisplayTheme/textDisplayData";
import { FontData } from "./types/types";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayFontData);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const [textDisplayTheme, setTextDisplayTheme] = useState(defaultTheme);
  const [text, setText] = useState("");
  const [mistypedWords, setMistypedWords] = useState<Row["words"]>([]);
  // const [mistypedSymbols, setMistypedSymbols] = useState<string[]>([]);

  const timer = useRef(new Timer());

  const handleFontDataChange = async (fieldToUpdate: Partial<FontData>, callback?: () => any) => {
    const updatedField = Object.keys(fieldToUpdate) as (keyof FontData)[];
    const { fontFamily, fontSize } = { ...fontData, ...fieldToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);

    if(!newFontData) return;
    setIsFontDataLoading(true);
    
    if(updatedField.includes("fontSize")) {
      setTextDisplayTheme(prev => {
        const updatedState = { ...prev };
        const updatedPadding = `0.5rem ${transformPixelSizeToNumber(fontSize) / 20}rem`;
        updatedState.offset.display.padding = updatedPadding;
        return updatedState;
      });
      setIsFontDataLoading(false);
    }
    
    if(updatedField.includes("fontFamily")) {
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
    <ThemeProvider theme={appTheme}>
      <Router>
        <Switch>
          <Route path="/mainMenu">
            <MainMenu setText={setText} text={text} />
          </Route>
          <Route path="/playArea">
            <PlayPage
              fontData={fontData}
              handleFontDataChange={handleFontDataChange}
              isFontDataLoading={isFontDataLoading}
              setMistypedWords={setMistypedWords}
              setTextDisplayTheme={setTextDisplayTheme}
              text={text}
              textDisplayTheme={textDisplayTheme}
              timer={timer.current} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

// TODO add sounds like in www.typingclub.com
// TODO way to handle mistakes:
//  - stop at the current character and wait till the current one is pressed
//  - continue to the next character
//  - allow backspace
// TODO add $nbsp; after prepositions

// TODO handle failed font fetch