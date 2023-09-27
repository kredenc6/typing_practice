import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, ButtonGroup, SvgIcon } from "@mui/material";
import normalizeParagraphTexts from "../../textFunctions/normalizeParagraphTexts";
import LoadTextSection from "../../components/LoadTextSection/LoadTextSection";
import TextFieldSection from "../../components/TextFieldSection/TextFieldSection";
import InvalidSymbolsMessage from "../../components/InvalidSymbolsMessage/InvalidSymbolsMessage";
import getArticle from "../../async/getArticle";
import extractParagraphsFromHtml from "../../textFunctions/extractParagraphsFromHtml";
import adjustLoadedTextLength from "../../textFunctions/adjustLoadedTextLength";
import { getInvalidSymbols } from "../../helpFunctions/getInvalidSymbols";
import adjustTextGeneral from "../../textFunctions/adjustTextGeneral";
import { useTextToTextField } from "../../customHooks/useTextToTextField";
import ThemeSwitch from "../../components/ThemeSwith/ThemeSwith";
import { ReactComponent as StatisticsIcon } from "../../svg/bar-chart-24px.svg";
import { KeyboardAlt as KeyboardIcon } from "@mui/icons-material";
import { CSSObjects } from "../../types/themeTypes";
import { User } from "../../types/otherTypes";
import UserCard from "../../components/UserCard/UserCard";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  knownSymbols: string[];
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface InsertTextOnLoad {
  length: number;
  boolean: boolean;
}

const styles: CSSObjects = {
  mainMenu: ({ palette }) => ({
    maxWidth: "1920px",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    margin: "0 auto",
    backgroundColor: palette.background.default,
    color: palette.text.primary
  }),
  buttons: {
    alignSelf: "center",
    marginTop: "2rem"
  }
};

// TODO setText maximum length
export default function MainMenu({ setText, knownSymbols, user, setUser }: Props) {
  const [loadedParagraphs, setLoadedParagraphs] = useState<string[]>([]);
  const [insertTextOnLoad, setInsertTextOnLoad] = useState<InsertTextOnLoad>({
    length: 100, boolean: true
  });
  const [textInput, setTextInput] = useTextToTextField();

  // DEBUGGING
  const handleTest = () => {
    // console.log("FONT_DATA");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.FONT_DATA));
    // console.log("LAST_RESULTS");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_RESULTS));
    // console.log("MISTYPED_WORDS");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS));
    // console.log("MISTYPE_SETTINGS");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPE_SETTINGS));
    // console.log("TEXT_DISPLAY_THEME");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.TEXT_DISPLAY_THEME));
    // console.log("THEME_TYPES");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.THEME_TYPES));
    // console.log("USER");
    // console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.USER));

    console.log("Deleting saved mistyped words.");
    localStorage.removeItem(LOCAL_STORAGE_KEYS.MISTYPED_WORDS);
  };

  // END OF DEBUGGING

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    setUser(null)
  };

  const handleStart = async () => {
    const cleanedText = await adjustTextGeneral(textInput);
    setText(cleanedText);
    
    setTimeout(() => { // "click" after the state update (react 18+)
      document.getElementById("link-to-playArea")!.click();
    }, 0)
  };

  const goToStatistics = () => {
    document.getElementById("link-to-statistics")!.click();
  };

  const handleLoadArcticle = async (relativePath: string) => {
    const html = await getArticle(relativePath);
    const articleParagraphs = extractParagraphsFromHtml(html);
    // TODO add spaces to start and end? of the text + the standart normalize is still triggered
    const normalizedParagraphs = await normalizeParagraphTexts(articleParagraphs);
    
    setLoadedParagraphs(normalizedParagraphs);
    
    if(insertTextOnLoad.boolean) {
      const finalText = adjustLoadedTextLength(normalizedParagraphs, insertTextOnLoad.length);
      setTextInput(finalText);
    }
  };

  const handleInsertParagraph = (paragraph: string) => {
    let newTextInput = textInput;
    
    if(textInput.length) {
      newTextInput += " ";
    }

    newTextInput += paragraph;
    setTextInput(newTextInput);
  };

  const handleInsertTextOnLoadChange = (changeObj: Partial<InsertTextOnLoad>) => {
    console.log("changeObj", changeObj)
    setInsertTextOnLoad(prev => {
      const updatedObj = { ...prev, ...changeObj };
      localStorage.setItem("typingPracticeInsertTextOnLoad", JSON.stringify(updatedObj));
      return updatedObj;
    });
  };

  useEffect(() => {
    const loadedInsertTextOnLoad = localStorage.getItem("typingPracticeInsertTextOnLoad");
    loadedInsertTextOnLoad && setInsertTextOnLoad(JSON.parse(loadedInsertTextOnLoad));
  },[])

  return (
    <Box sx={styles.mainMenu}>
      <UserCard user={user} logout={logout} />
      <ThemeSwitch />
      <TextFieldSection setTextInput={setTextInput} textInput={textInput} />
      <LoadTextSection
        handleLoadArcticle={handleLoadArcticle}
        loadedParagraphs={loadedParagraphs}
        handleInsertParagraph={handleInsertParagraph}
        insertTextOnLoad={insertTextOnLoad}
        handleInsertTextOnLoadChange={handleInsertTextOnLoadChange} />
      <Link id="link-to-playArea" style={{ display: "none" }} to="playArea"></Link>
      <Link id="link-to-statistics" style={{ display: "none" }} to="statistics"></Link>
      <ButtonGroup sx={styles.buttons} variant="contained" size="large" disableElevation>
        <Button
          disabled={!textInput}
          onClick={handleStart}
          startIcon={<KeyboardIcon sx={{ width: "1.7rem", height: "1.7rem" }} />}
        >
          Start
        </Button>
        <Button
          onClick={goToStatistics}
          startIcon={
            <SvgIcon
              component={StatisticsIcon}
              inheritViewBox />
          }
        >
          Výsledky
        </Button>
        {/* DEBUGGING */}
        <Button onClick={handleTest}>
          test
        </Button>
        
      </ButtonGroup>
      <InvalidSymbolsMessage invalidSymbols={getInvalidSymbols(textInput, knownSymbols)} />
    </Box>
  );
}
