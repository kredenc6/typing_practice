import React, { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core";
import PlayPage from "./pages/PlayPage/PlayPage";
import MainMenu from "./pages/MainMenu/MainMenu";
import Timer from "./accessories/Timer";
import getFontData from "./async/getFontData";
import loadFont from "./async/loadFont";
import { defaultTextDisplayFontData } from "./styles/textDisplayTheme/textDisplayData";
import { FontData } from "./types/themeTypes";
import { ThemeContext } from "./styles/themeContext";
import { createUpdatedAppTheme } from "./styles/appTheme";
import { AllowedMistype } from "./types/otherTypes";
import { getKnownSymbols } from "./helpFunctions/getKnownSymbols";
import "simplebar/dist/simplebar.min.css";

export default function App() {
  const [fontData, setFontData] = useState(defaultTextDisplayFontData);
  const [isFontDataLoading, setIsFontDataLoading] = useState(false);
  const [text, setText] = useState("");
  const { state: theme } = useContext(ThemeContext);
  const [allowedMistype, setAllowedMistype] = useState<AllowedMistype>({
    count: 1, isAllowed: true
  });

  const timer = useRef(new Timer());

  const handleFontDataChange = async (fieldToUpdate: Partial<FontData>, callback?: () => any) => {
    const updatedFields = Object.keys(fieldToUpdate) as (keyof FontData)[];
    const { fontFamily, fontSize } = { ...fontData, ...fieldToUpdate };
    const newFontData = await getFontData(fontFamily, fontSize);

    if(!newFontData) return;
    setIsFontDataLoading(true);
    
    if(updatedFields.includes("fontSize")) {
      const updatedTextDisplayTheme = { ...theme.textDisplayTheme };
      const updatedSidePadding = fontSize;
      updatedTextDisplayTheme.offset.display.paddingRight = updatedSidePadding;
      updatedTextDisplayTheme.offset.display.paddingLeft = updatedSidePadding;
      createUpdatedAppTheme({ textDisplayTheme: updatedTextDisplayTheme });
      setIsFontDataLoading(false);
    }
    
    if(updatedFields.includes("fontFamily")) {
      if(newFontData.fontLocation === "local") {
        setFontData(newFontData);
        callback && callback();
        setIsFontDataLoading(false);
      } else {
        loadFont(newFontData, setFontData, () => {
          callback && callback();
          setIsFontDataLoading(false);
        });
      }
      return;
    }

    setFontData(newFontData);
  };

  useEffect(() => {
    const { fontFamily, fontSize } = fontData;
    getFontData(fontFamily, fontSize)
      .then(newFontData => {
        if(!newFontData) return;
        handleFontDataChange(newFontData);
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/mainMenu" />
          </Route>
          <Route path="/mainMenu">
            <MainMenu setText={setText} knownSymbols={getKnownSymbols(fontData)} />
          </Route>
          <Route path="/playArea">
            <PlayPage
              fontData={fontData}
              handleFontDataChange={handleFontDataChange}
              isFontDataLoading={isFontDataLoading}
              text={text}
              timer={timer.current}
              setAllowedMistype={setAllowedMistype}
              allowedMistype={allowedMistype} />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}

// TODO add typing sounds
// TODO add $nbsp; after prepositions

// TODO handle failed font fetch

// TODO make links and comments for used sources like wiki and osel(here I should probably ask for permision)
// TODO display url of the loaded article
