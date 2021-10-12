import React, { useEffect, useState } from "react";
import { makeStyles, Fade } from "@material-ui/core";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import TypingResults from "../../components/TypingResults/TypingResults";
import { FontData } from "../../types/themeTypes";
import Timer from "../../accessories/Timer";
import { AllowedMistype, GameStatus, Results } from "../../types/otherTypes";
import { saveMistypedWords } from "../../components/TextDisplay/helpFunctions";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  text: string;
  timer: Timer;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

const useStyles = makeStyles(({ textDisplayTheme }) => ({
  playPage: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: textDisplayTheme.background.main
  },
  resultWrapper: {
    flexGrow: 1,
    zIndex: 2
  }
}));

export default function PlayPage({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  text,
  timer,
  setAllowedMistype,
  allowedMistype
}: Props) {
  const classes = useStyles();
  const [restart , setRestart] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [resultObj, setResultObj] = useState<Results | null>(null);

  useEffect(() => {
    if(!resultObj) return;
    
    saveMistypedWords(resultObj.mistypedWords);
    const last3ResultsString = localStorage.getItem("typingPracticeLast3Results") || "[]";
    const last3Results = [
        ...JSON.parse(last3ResultsString),
        resultObj
      ]
      .slice(0, 3);

    localStorage.setItem("typingPracticeLast3Results", JSON.stringify(last3Results));
  }, [resultObj])

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
        setRestart={setRestart}
        text={text}
        timer={timer}
        allowedMistype={allowedMistype}
        gameStatus={gameStatus}
        setGameStatus={setGameStatus}
        setResultObj={setResultObj} />
      <Fade in={gameStatus === "finished"}>
        <div className={classes.resultWrapper}>
          <TypingResults resultObj={resultObj} />
        </div>
      </Fade>
    </div>
  );
}
