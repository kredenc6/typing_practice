import React, { useEffect, useState } from "react";
import Settings from "./components/Settings/Settings";
import TextDisplay from "./components/TextDisplay/TextDisplay";
import Timer from "./accessories/Timer";
import { Row } from "./textFunctions/transformTextToSymbolRows";
import { defaultTheme, ThemeProvider } from "./styles/theme";

export default function App() {
  const [text, setText] = useState("");
  const [timer, setTimer] = useState(new Timer());
  const [mistypedWords, setMistypedWords] = useState<Row["words"]>([]);
  const [mistypedSymbols, setMistypedSymbols] = useState<string[]>([]);

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
    <ThemeProvider theme={defaultTheme}>
      <div>
        <Settings setText={setText} text={text} />
        <p style={{ fontSize: "30px" }}>This is just a test text.</p>
        <TextDisplay setMistypedWords={setMistypedWords} text={text} timer={timer} />
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