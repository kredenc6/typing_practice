import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import { FontData } from "../../types/themeTypes";
import { Row } from "../../types/symbolTypes";
import Timer from "../../accessories/Timer";
import { AllowedMistype } from "../../types/otherTypes";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  setMistypedWords: React.Dispatch<React.SetStateAction<Row["words"]>>;
  text: string;
  timer: Timer;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

const useStyles = makeStyles(({ textDisplayTheme }) => ({
  playPage: {
    height: "100vh",
    overflow: "hidden",
    backgroundColor: textDisplayTheme.background.main
  }
}));

export default function PlayPage({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  setMistypedWords,
  text,
  timer,
  setAllowedMistype,
  allowedMistype
}: Props) {
  const classes = useStyles();
  const [restart , setRestart] = useState(false);

  return (
    <div className={classes.playPage}>
      <PlaySettings
        fontData={fontData}
        handleFontDataChange={handleFontDataChange}
        isFontDataLoading={isFontDataLoading}
        restart={restart}
        setRestart={setRestart}
        setAllowedMistype={setAllowedMistype}
        allowedMistype={allowedMistype} />
      <TextDisplay
        fontData={fontData}
        restart={restart}
        setMistypedWords={setMistypedWords}
        setRestart={setRestart}
        text={text}
        timer={timer}
        allowedMistype={allowedMistype} />
    </div>
  );
}
