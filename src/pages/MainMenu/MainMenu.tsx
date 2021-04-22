import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, makeStyles } from "@material-ui/core";
import TextInput from "../../components/TextInput/TextInput";
import TextNormalizeSwitches from "./TextNormalizeSwitches/TextNormalizeSwitches";
import normalizeText from "../../textFunctions/normalizeText";
import normalizeParagraphTexts from "../../textFunctions/normalizeParagraphTexts";
import getArticle from "../../async/getArticle";
import extractParagraphsFromHtml from "../../textFunctions/extractParagraphsFromHtml";
import adjustLoadedTextLength from "../../textFunctions/adjustLoadedTextLength";

const TEXT_NORMALIZE_DELAY = 2000;

interface Props {
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}

const useStyles = makeStyles({
  mainMenu: {
    maxWidth: "1920px",
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexFlow: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto"
  },
  startButton: {
    margin: "1rem auto"
  },
  textSettingsWrapper: {
    width: "100%",
    display: "flex",
    margin: "1rem",
    padding: "1rem"
  }
});

// TODO setText maximum length
export default function MainMenu({ setText, text }: Props) {
  const classes = useStyles();
  const [textInput, setTextInput] = useState("");
  const [generalNormalize] = useState(true);
  const [wikiNormalize, setWikiNormalize] = useState(true);
  const [czechKeyboardNormalize, setCzechKeyboardNormalize] = useState(true);
  const [loadedParagraphs, setLoadedParagraphs] = useState<string []>([]);
  const timeoutIdRef = useRef(-1);
  const handleInputChange = (text: string) => {
    setTextInput(text);
  };

  const handleStart = () => {
    document.getElementById("link-to-playArea")!.click();
  };

  const handleSwitchChange = (adjustedText: string) => {
    if(timeoutIdRef.current !== -1) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = -1;
    }
    setText(adjustedText);
    setTextInput(adjustedText);
  };

  const handleLoadArcticle = async (relativePath: string) => {
    const html = await getArticle(relativePath);
    const articleParagraphs = extractParagraphsFromHtml(html);
    const normalizedParagraphs = await normalizeParagraphTexts( // TODO add spaces to start and end of the text + the standart normalize is still triggered
      articleParagraphs,
      wikiNormalize,
      czechKeyboardNormalize
    );
    
    setLoadedParagraphs(normalizedParagraphs);
    
    const finalText = adjustLoadedTextLength(normalizedParagraphs, 1000); // TODO make this user adjustable
    setTextInput(finalText);
  };

  useEffect(() => {
    if(textInput === text) return;
    if(timeoutIdRef.current !== -1) {
      clearTimeout(timeoutIdRef.current);
    }
    
    timeoutIdRef.current = window.setTimeout(async () => {
      const adjustedText = await normalizeText(textInput, wikiNormalize, czechKeyboardNormalize);
      
      timeoutIdRef.current = -1;
      setText(adjustedText);
      setTextInput(adjustedText);
    }, TEXT_NORMALIZE_DELAY);
  })

  return (
    <div className={classes.mainMenu}>
      <Link id="link-to-playArea" style={{ display: "none" }} to="playArea"></Link>
      <Button onClick={() => handleLoadArcticle("/randomWiki")}>Load random wiki</Button>
      <Button onClick={() => handleLoadArcticle("/wikiArticleOfTheWeek")}>Load week wiki</Button>
      <Button onClick={() => handleLoadArcticle("/oselLastArticle")}>Load last Osel</Button>
      <div className={classes.textSettingsWrapper}>
        <TextInput
          handleInputChange={handleInputChange}
          id="text-input"
          name="textInput"
          value={textInput} variant="outlined" />
        <TextNormalizeSwitches
          czechKeyboardNormalize={czechKeyboardNormalize}
          generalNormalize={generalNormalize}
          handleSwitchChange={handleSwitchChange}
          setCzechKeyboardNormalize={setCzechKeyboardNormalize}
          setWikiNormalize={setWikiNormalize}
          textInput={textInput}
          wikiNormalize={wikiNormalize} />
      </div>
      <Button
        className={classes.startButton}
        color="primary"
        disabled={!text || textInput !== text}
        onClick={handleStart}
        size="large"
        variant="contained"
      >
        Start
      </Button>
    </div>
  );
}
