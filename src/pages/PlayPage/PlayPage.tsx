import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import { FontData, TextDisplayTheme } from "../../types/types";
import { Row } from "../../textFunctions/transformTextToSymbolRows";
import Timer from "../../accessories/Timer";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  setTextDisplayTheme: React.Dispatch<React.SetStateAction<TextDisplayTheme>>
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
  setMistypedWords,
  setTextDisplayTheme,
  text,
  textDisplayTheme,
  timer
}: Props) {
  const classes = useStyles(textDisplayTheme);

  return (
    <Box className={classes.playPage}>
      <PlaySettings
        fontData={fontData}
        handleFontDataChange={handleFontDataChange}
        setTextDisplayTheme={setTextDisplayTheme}
        textDisplayTheme={textDisplayTheme} />
      <TextDisplay
        fontData={fontData}
        setMistypedWords={setMistypedWords}
        text={text}
        theme={textDisplayTheme}
        timer={timer} />
    </Box>
  );
}
