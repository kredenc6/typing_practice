import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, makeStyles } from "@material-ui/core";
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

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  knownSymbols: string[];
}

export interface InsertTextOnLoad {
  length: number;
  boolean: boolean;
}

const useStyles = makeStyles(({ palette }) => ({
  mainMenu: {
    maxWidth: "1920px",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    margin: "0 auto",
    backgroundColor: palette.background.default,
    color: palette.text.primary
  },
  startButton: {
    margin: "1rem auto"
  }
}));
// const useStyles = makeStyles({
//   mainMenu: {
//     maxWidth: "1920px",
//     width: "100vw",
//     height: "100vh",
//     display: "flex",
//     flexFlow: "column",
//     margin: "0 auto"
//   },
//   startButton: {
//     margin: "1rem auto"
//   }
// });

// TODO setText maximum length
export default function MainMenu({ setText, knownSymbols }: Props) {
  const classes = useStyles();
  const [loadedParagraphs, setLoadedParagraphs] = useState<string[]>([]);
  const [insertTextOnLoad, setInsertTextOnLoad] = useState<InsertTextOnLoad>({
    length: 100, boolean: true
  });
  const [textInput, setTextInput] = useTextToTextField();


  const handleStart = async () => {
    const cleanedText = await adjustTextGeneral(textInput);
    setText(cleanedText);
    document.getElementById("link-to-playArea")!.click();
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
    <Box className={classes.mainMenu}>
      <ThemeSwitch />
      <TextFieldSection setTextInput={setTextInput} textInput={textInput} />
      <LoadTextSection
        handleLoadArcticle={handleLoadArcticle}
        loadedParagraphs={loadedParagraphs}
        handleInsertParagraph={handleInsertParagraph}
        insertTextOnLoad={insertTextOnLoad}
        handleInsertTextOnLoadChange={handleInsertTextOnLoadChange} />
      <Link id="link-to-playArea" style={{ display: "none" }} to="playArea"></Link>
      <Button
        className={classes.startButton}
        color="primary"
        disabled={!textInput}
        onClick={handleStart}
        size="large"
        variant="contained"
      >
        Start
      </Button>
      <InvalidSymbolsMessage invalidSymbols={getInvalidSymbols(textInput, knownSymbols)} />
    </Box>
  );
}
