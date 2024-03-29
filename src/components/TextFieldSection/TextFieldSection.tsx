import { useState, useEffect } from "react";
import { Badge, Box, Button, Typography } from "@mui/material";
import TextInput from "../TextInput/TextInput";
import TextNormalizeSwitches from "./TextNormalizeSwitches/TextNormalizeSwitches";
import adjustTextGeneral from "../../textFunctions/adjustTextGeneral";
import adjustTextFromWiki from "../../textFunctions/adjustTextFromWiki";
import adjustTextForCzechKeyboard from "../../textFunctions/adjustTextForCzechKeyboard";
import { type Unsafe_Entries } from "../../types/otherTypes";
import { type CSSObjects } from "../../types/themeTypes";

interface Props {
  setTextInput: (text: string) => void;
  textInput: string;
}

type AdjustTextObj = {
  boolean: boolean;
  function: (text: string) => string;
  order: number;
}

export interface AdjustText {
  general: {
    boolean: boolean;
    function: (text: string) => Promise<string>;
    order: number;
  };
  fromWiki: AdjustTextObj;
  forCzechKeyboard: AdjustTextObj;
}

type LocalStorageAdjustText = {
  [P in keyof AdjustText]: boolean;
}

const styles: CSSObjects = {
  textFieldSection: {
    width: "85%",
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    columnGap: "4rem",
    margin: "1rem auto",
    padding: "1rem"
  },
  textFieldHeading: {
    gridColumn: "1 / 4"
  },
  textField: {
    gridColumn: "1 / 3",
    minWidth: "500px",
    width: "100%"
  },
  switchWrapper: {
    gridColumn: "4 / 4",
    height: "100%",
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-between",
    alignItem: "center"
  }
};

export default function TextFieldSection({ setTextInput, textInput }: Props) {
  const [adjustText, setAdjustText] = useState<AdjustText>({
    general: { boolean: true, function: adjustTextGeneral, order: 3 },
    fromWiki: { boolean: true, function: adjustTextFromWiki, order: 1 },
    forCzechKeyboard: { boolean: true, function: adjustTextForCzechKeyboard, order: 2 }
  });
  
  const handleInputChange = (text: string) => {
    setTextInput(text);
  };

  const handleSwitchChange = (propName: keyof AdjustText, boolean: boolean) => {
    const updatedAdjustText = {
      ...adjustText, [propName]: { ...adjustText[propName], boolean }
    };
    setAdjustText(updatedAdjustText);

    const adjustTextEntries = Object.entries(updatedAdjustText) as Unsafe_Entries<AdjustText>;
    const localStorageAdjustText = adjustTextEntries.reduce((acc, [key, { boolean }]) => {
      acc[key] = boolean;
      return acc;
    }, {} as LocalStorageAdjustText);

    localStorage.setItem("typingPracticeAdjustText", JSON.stringify(localStorageAdjustText));
  };

  const handleAdjustText = async () => {
    let adjustedText = textInput;
    const adjustTextFunctions = Object.values(adjustText)
      .filter(value => value.boolean)
      .sort((valueA, valueB) => valueA.order - valueB.order)
      .map(value => value.function);

    for(const adjustTextFunction of adjustTextFunctions) {
      adjustedText = await adjustTextFunction(adjustedText);
    }

    setTextInput(adjustedText);
  }

  // load local storage values for adjust text switches
  useEffect(() => {
    const localStorageAdjustText = localStorage.getItem("typingPracticeAdjustText");
    if(localStorageAdjustText) {
      setAdjustText(prev => {
        const updatedAdjustText = { ...prev };
        const adjustTextEntries = Object.entries(JSON.parse(localStorageAdjustText)) as Unsafe_Entries<LocalStorageAdjustText>;
        
        adjustTextEntries.forEach(([key, boolean]) => {
          updatedAdjustText[key].boolean = boolean;
        })
        
        return updatedAdjustText;
      })
    }
  }, [])

  return (
    <Box sx={styles.textFieldSection}>
      <Typography sx={styles.textFieldHeading} variant="h5" component="h6">
        Text k opsání
      </Typography>
      <Badge
        sx={styles.textField}
        color="primary"
        badgeContent={textInput.length ? `${textInput.length} znaků` : 0}
      >
        <TextInput
          handleInputChange={handleInputChange}
          id="text-input"
          name="textInput"
          value={textInput}
          variant="outlined" />
      </Badge>
      <Box sx={styles.switchWrapper}>
        <TextNormalizeSwitches
          adjustText={adjustText}
          setAdjustText={setAdjustText}
          handleSwitchChange={handleSwitchChange}
          textInput={textInput} />
        <Button variant="contained" color="primary" onClick={handleAdjustText}>
          Uprav text
        </Button>
      </Box>
    </Box>
  );
}
