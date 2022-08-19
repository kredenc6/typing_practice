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
import { CSSObjects } from "../../types/themeTypes";

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  knownSymbols: string[];
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
export default function MainMenu({ setText, knownSymbols }: Props) {
  const [loadedParagraphs, setLoadedParagraphs] = useState<string[]>([]);
  const [insertTextOnLoad, setInsertTextOnLoad] = useState<InsertTextOnLoad>({
    length: 100, boolean: true
  });
  const [textInput, setTextInput] = useTextToTextField();


  const handleStart = async () => {
    const cleanedText = await adjustTextGeneral(textInput);
    setText(cleanedText);
    
    setTimeout(() => { // "click" after the state update (react 18+)
      document.getElementById("link-to-playArea")!.click();
    }, 0)
  };

  const moveToStatistics = () => {
    document.getElementById("link-to-statistics")!.click();
  };

  const handleLoadArcticle = async (relativePath: string) => {
    const html = await getArticle(relativePath);
    const articleParagraphs = extractParagraphsFromHtml(html);
    // TODO add spaces to start and end of the text + the standart normalize is still triggered
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
        <Button disabled={!textInput} onClick={handleStart}>Start</Button>
        <Button
          onClick={moveToStatistics}
          startIcon={
            <SvgIcon
              component={StatisticsIcon}
              inheritViewBox />
          }
        >
          Výsledky
        </Button>
      </ButtonGroup>
      <InvalidSymbolsMessage invalidSymbols={getInvalidSymbols(textInput, knownSymbols)} />
    </Box>
  );
}
