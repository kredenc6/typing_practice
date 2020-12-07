import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@material-ui/core";
import Settings from "./components/Settings/Settings";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import Timer from "./accessories/Timer";
import { Row } from "./textFunctions/transformTextToSymbolRows";
import getFontData from "./async/getFontData";
import appTheme from "./styles/themes";
import defaultTextDisplayData from "./styles/textDisplayTheme/textDisplayData";
import { FontData, RequireAtLeastOne } from "./types/types";
import loadFont from "./async/loadFont";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayData);
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(new Timer());
  const [mistypedWords, setMistypedWords] = useState<Row["words"]>([]);
  const [mistypedSymbols, setMistypedSymbols] = useState<string[]>([]);

  const handleFontDataChange = async (fieldsToUpdate: RequireAtLeastOne<Pick<FontData, "fontFamily" | "fontSize">>) => {
    const { fontFamily, fontSize } = { ...fontData, ...fieldsToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);
    if(!newFontData) return;
    if(newFontData.fontLocation === "local") {
      setFontData(newFontData);
    } else {
      loadFont(newFontData, setFontData);
    }
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
      const time = timer.getTime();
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
      <div>
        <Settings
          fontData={fontData}
          handleFontDataChange={handleFontDataChange}
          setText={setText}
          text={text} />
        <p style={{ fontSize: "30px" }}>This is just a test text.</p>
        <TextDisplay
          fontData={fontData}
          setMistypedWords={setMistypedWords}
          text={text}
          timer={timer} />
      </div>
    </ThemeProvider>
  );
}

// TODO add sounds like in www.typingclub.com
// TODO way to handle mistakes:
//  - stop at the current character and wait till the current one is pressed
//  - continue to the next character
//  - allow backspace
// TODO add $nbsp; after prepositions