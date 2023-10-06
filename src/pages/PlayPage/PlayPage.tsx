import React, { useEffect, useState, useContext } from "react";
import { Fade, Box } from "@mui/material";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import TypingResults from "../../components/TypingResults/TypingResults";
import { FontData } from "../../types/themeTypes";
import { Redirect } from "react-router";
import Timer from "../../accessories/Timer";
import { AllowedMistype, GameStatus, MistypedWordsLog, ResultObj, LatestResult } from "../../types/otherTypes";
import { updateLatestResults, updateMistypedWords } from "../../components/TextDisplay/helpFunctions";
import { PlayPageThemeContext } from "../../styles/themeContexts";
import handleError from "../../helpFunctions/handleError";
import { updateUser } from "../../database/endpoints";
import { minifyMistypedWordsLog } from "../../appHelpFunctions";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  text: string;
  timer: Timer;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
  userId: string | null;
  savedMistypedWords: MistypedWordsLog | null;
  setSavedMistypedWords: React.Dispatch<React.SetStateAction<MistypedWordsLog | null>>;
  latestResults: LatestResult[] | null;
  setLatestResults: React.Dispatch<React.SetStateAction<LatestResult[] | null>>;
}

export default function PlayPage({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  text,
  timer,
  setAllowedMistype,
  allowedMistype,
  userId,
  savedMistypedWords,
  setSavedMistypedWords,
  latestResults,
  setLatestResults
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext); 
  const [restart , setRestart] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [resultObj, setResultObj] = useState<ResultObj | null>(null);

  useEffect(() => {
    if(!resultObj || !userId) return;
    
    const updatedMistypedWordsLog = updateMistypedWords(resultObj.mistypedWords, savedMistypedWords);
    const minifiedMistypedWordsLog = minifyMistypedWordsLog(updatedMistypedWordsLog);
    const minifiedMistypedWordsLogString = JSON.stringify(minifiedMistypedWordsLog);
    
    const updatedLatestResults = updateLatestResults(resultObj, latestResults);
    const latestResultsString = JSON.stringify(updatedLatestResults);
    
    updateUser(userId, { m: minifiedMistypedWordsLogString, r: latestResultsString }) // BUG CHECK IF IT COUNTS AS A 1 WRITE OR 2!!!!!!!!!!
      .then(() => {
        setSavedMistypedWords(updatedMistypedWordsLog);
        setLatestResults(updatedLatestResults);
        console.log("Mistyped words and latest results saved successfuly.");
      })
      .catch(error => {
        handleError(error);
      });
    
    // run the hook only if the resultObj changes!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultObj])

  return (
    !text
      ? <Redirect to="/mainMenu" />
      : <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundColor: textDisplayTheme.background.main
          }}
        >
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
            <Box sx={{ flexGrow: 1, zIndex: 2 }}>
              <TypingResults resultObj={resultObj} />
            </Box>
          </Fade>
        </Box>
  );
}
