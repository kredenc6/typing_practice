import React, { useEffect, useState, useContext } from "react";
import { Fade, Box } from "@mui/material";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import TypingResults from "../../components/TypingResults/TypingResults";
import { FontData } from "../../types/themeTypes";
import { Redirect } from "react-router";
import Timer from "../../accessories/Timer";
import { AllowedMistype, GameStatus, Results } from "../../types/otherTypes";
import { saveMistypedWordsV2 } from "../../components/TextDisplay/helpFunctions";
import { LAST_RESULTS_SAVE_COUNT, LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { PlayPageThemeContext } from "../../styles/themeContexts";

interface Props {
  fontData: FontData;
  handleFontDataChange: (fieldsToUpdate: Partial<Pick<FontData, "fontFamily" | "fontSize">>) => Promise<void>;
  isFontDataLoading: boolean;
  text: string;
  timer: Timer;
  setAllowedMistype: React.Dispatch<React.SetStateAction<AllowedMistype>>;
  allowedMistype: AllowedMistype;
}

export default function PlayPage({
  fontData,
  handleFontDataChange,
  isFontDataLoading,
  text,
  timer,
  setAllowedMistype,
  allowedMistype
}: Props) {
  const { state: textDisplayTheme } = useContext(PlayPageThemeContext); 
  const [restart , setRestart] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [resultObj, setResultObj] = useState<Results | null>(null);

  useEffect(() => {
    if(!resultObj) return;
    
    saveMistypedWordsV2(resultObj.mistypedWords);
    const lastResultsString = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_RESULTS) || "[]";
    const lastResults = [
        ...JSON.parse(lastResultsString),
        resultObj
      ]
      .slice(-LAST_RESULTS_SAVE_COUNT);
      
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_RESULTS, JSON.stringify(lastResults));
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
