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
import { CSSObjects, FontData } from "../../types/themeTypes";
import { User } from "../../types/otherTypes";
import UserCard from "../../components/UserCard/UserCard";
import { auth } from "../../database/firebase";
import { LOCAL_STORAGE_KEYS } from "../../constants/constants";
import { getKnownSymbols } from "../../helpFunctions/getKnownSymbols";
import getFontData from "../../async/getFontData";
import { defaultTextDisplayFontStyle } from "../../styles/textDisplayTheme/textDisplayData";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  fontData: FontData | null;
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
export default function MainMenu({ setText, fontData, user, setUser }: Props) {
  const [loadedParagraphs, setLoadedParagraphs] = useState<string[]>([]);
  const [insertTextOnLoad, setInsertTextOnLoad] = useState<InsertTextOnLoad>({
    length: 100, boolean: true
  });
  const [textInput, setTextInput] = useTextToTextField();
  const [knownSymbols, setKnownSymbols] = useState<string[] | null>(null);

  const logout = () => {
    // TODO handle failed logout (signOut's promise)
    auth.signOut();
    // setUser(null)
  };

  const handleTest = () => {
    // console.log("There's no test atm.");
    console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.FONT_DATA));
    console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.MISTYPE_SETTINGS));
    console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.PLAY_PAGE_THEME));
    console.log(localStorage.getItem(LOCAL_STORAGE_KEYS.THEME_TYPES));
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

  // Load valid symbols.
  useEffect(() => {
    const {fontFamily, fontSize} = defaultTextDisplayFontStyle;
    getFontData(fontFamily, fontSize)
      .then(newFontData => {
        setKnownSymbols(Object.keys(newFontData.symbolWidths));
      })
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
        <Button onClick={handleTest}>test</Button>
      </ButtonGroup>
      {knownSymbols &&
        <InvalidSymbolsMessage invalidSymbols={getInvalidSymbols(textInput, knownSymbols)} />}
    </Box>
  );
}
