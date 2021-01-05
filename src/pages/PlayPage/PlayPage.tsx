import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import { FontData, TextDisplayTheme } from "../../types/types";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<TextDisplayTheme>>;
  text: string;
  textDisplayTheme: TextDisplayTheme;
  timer: Timer;
}

const useStyles = makeStyles({
  playPage: {
    height: "100vh",
    overflow: "hidden",
    backgroundColor: (({ palette }: TextDisplayTheme) => palette.background.main)
  }
});

export default function PlayPage({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  setMistypedWords,
  setTextDisplayTheme,
  text,
  textDisplayTheme,
  timer
}: Props) {
  const classes = useStyles(textDisplayTheme);
  const [restart , setRestart] = useState(false);

  return (
    <div className={classes.playPage}>
      <PlaySettings
        fontData={fontData}
        handleFontDataChange={handleFontDataChange}
        isFontDataLoading={isFontDataLoading}
        restart={restart}
        setRestart={setRestart}
        setTextDisplayTheme={setTextDisplayTheme}
        textDisplayTheme={textDisplayTheme} />
      <TextDisplay
        fontData={fontData}
        restart={restart}
        setMistypedWords={setMistypedWords}
        setRestart={setRestart}
        text={text}
        theme={textDisplayTheme}
        timer={timer} />
    </div>
  );
}
