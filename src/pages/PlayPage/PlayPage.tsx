import React, { useEffect, useState } from "react";
import { Fade, Box } from "@mui/material";
import PlaySettings from "../../components/PlaySettings/PlaySettings";
import TextDisplay from "../../components/TextDisplay/TextDisplay";
import TypingResults from "../../components/TypingResults/TypingResults";
import { FontData } from "../../types/themeTypes";
import { Redirect } from "react-router";
import Timer from "../../accessories/Timer";
import { AllowedMistype, GameStatus, MistypedWordsLog, ResultObj, LatestResult } from "../../types/otherTypes";
import { updateLatestResults, updateMistypedWords } from "../../components/TextDisplay/helpFunctions";
import { usePlayPageTheme } from "../../styles/themeContexts";
import handleError from "../../helpFunctions/handleError";
import { updateUser } from "../../database/endpoints";
import { addUserIdToStorageKey, minifyMistypedWordsLog } from "../../appHelpFunctions";
import getFontData from "../../async/getFontData";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import loadFont from "../../async/loadFont";
import Footer from "../../components/Footer/Footer";

interface Props {
  fontData: FontData;
  setFontData: React.Dispatch<React.SetStateAction<FontData | null>>;
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
  setFontData,
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
  const [restart , setRestart] = useState(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("settingUp");
  const [resultObj, setResultObj] = useState<ResultObj | null>(null);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const { state: playPageTheme, update: updatePlayPageTheme } = usePlayPageTheme()!;

  const handleFontDataChange = async (fieldToUpdate: Partial<FontData>, callback?: () => any) => {
    if(!userId) return;
    console.log("Font Data Change:");
    console.log({fieldToUpdate, callback});

    const updatedFields = Object.keys(fieldToUpdate) as (keyof FontData)[];
    const { fontFamily, fontSize } = { ...fontData, ...fieldToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);

    if(!newFontData) return;
    setIsFontDataLoading(true);
    
    // When the font size changes, playPageTheme offsets need to be adjusted.
    if(updatedFields.includes("fontSize")) {
      // Make the adjustements.
      const updatedTextDisplayTheme = { ...playPageTheme };
      const updatedSidePadding = fontSize;
      updatedTextDisplayTheme.offset.display.paddingRight = updatedSidePadding;
      updatedTextDisplayTheme.offset.display.paddingLeft = updatedSidePadding;

      // Update the play page theme context.
      updatePlayPageTheme(updatedTextDisplayTheme);

      // Run callbacks if available.
      callback && callback();
      
      // Save changes to the local storage.
      const key = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.PLAY_PAGE_THEME);
      localStorage.setItem(key, JSON.stringify(updatedTextDisplayTheme));

      setIsFontDataLoading(false);
    }
    
    if(updatedFields.includes("fontFamily")) {
      if(newFontData.fontLocation === "local") {
        setFontData(newFontData);
        callback && callback();
        setIsFontDataLoading(false);
      } else {
        loadFont(newFontData, () => {
          callback && callback();
          setFontData(newFontData);
          setIsFontDataLoading(false);
        });
      }
      const key = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.FONT_DATA);
      localStorage.setItem(key, JSON.stringify(newFontData));
      return;
    }
    
    setFontData(newFontData);
    const key = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.FONT_DATA);
    localStorage.setItem(key, JSON.stringify(newFontData));
  };

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

  useEffect(() => {
    if(!userId) return;

    const mistypeSettingsKey = addUserIdToStorageKey(userId, LOCAL_STORAGE_KEYS.MISTYPE_SETTINGS);
    const loadedMistypeSetting = localStorage.getItem(mistypeSettingsKey);
    if(loadedMistypeSetting) {
      setAllowedMistype(JSON.parse(loadedMistypeSetting) as AllowedMistype);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    !text
      ? <Redirect to="/mainMenu" />
      : <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundColor: playPageTheme.background.main
          }}
        >
          <PlaySettings
            fontData={fontData}
            handleFontDataChange={handleFontDataChange}
            isFontDataLoading={isFontDataLoading}
            restart={restart}
            setRestart={setRestart}
            setAllowedMistype={setAllowedMistype}
            allowedMistype={allowedMistype}
            userId={userId} />
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
          <Footer />
        </Box>
  );
}
