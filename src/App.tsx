import React, { createContext, useEffect, useState } from "react";
import { ThemeProvider } from "@material-ui/core";
import Settings from "./components/Settings/Settings";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import Timer from "./accessories/Timer";
import { Row } from "./textFunctions/transformTextToSymbolRows";

import appTheme from "./styles/themes";
import importedTextDisplayTheme from "./styles/textDisplayTheme/textDisplayTheme";

export default function App() {
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(new Timer());
  const [mistypedWords, setMistypedWords] = useState<Row["words"]>([]);
  const [mistypedSymbols, setMistypedSymbols] = useState<string[]>([]);
  const [textDisplayTheme, setTextDisplayTheme] = useState(importedTextDisplayTheme);

  // const textDisplayThemeContext = createContext({ textDisplayTheme, setTextDisplayTheme });

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
          setText={setText}
          setTextDisplayTheme={setTextDisplayTheme}
          text={text}
          textDisplayTheme={textDisplayTheme} />
        <p style={{ fontSize: "30px" }}>This is just a test text.</p>
        <TextDisplay
          setMistypedWords={setMistypedWords}
          text={text}
          textDisplayTheme={textDisplayTheme}
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