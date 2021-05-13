import React, { useState } from "react";
import { Badge, Button, makeStyles, Typography } from "@material-ui/core";
import TextInput from "../TextInput/TextInput";
import TextNormalizeSwitches from "./TextNormalizeSwitches/TextNormalizeSwitches";
import adjustTextGeneral from "../../textFunctions/adjustTextGeneral";
import adjustTextFromWiki from "../../textFunctions/adjustTextFromWiki";
import adjustTextForCzechKeyboard from "../../textFunctions/adjustTextForCzechKeyboard";

interface Props {
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
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

const useStyles = makeStyles({
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
});

export default function TextFieldSection({ setTextInput, textInput }: Props) {
  const classes = useStyles();
  const [adjustText, setAdjustText] = useState<AdjustText>({
    general: { boolean: true, function: adjustTextGeneral, order: 3 },
    fromWiki: { boolean: true, function: adjustTextFromWiki, order: 1 },
    forCzechKeyboard: { boolean: true, function: adjustTextForCzechKeyboard, order: 2 }
  });
  
  const handleInputChange = (text: string) => {
    setTextInput(text);
  };

  const handleSwitchChange = (propName: keyof AdjustText, boolean: boolean) => {
    setAdjustText(prev => ({ ...prev, [propName]: { ...prev[propName], boolean } }));
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

  return (
    <div className={classes.textFieldSection}>
      <Typography
        className={classes.textFieldHeading}
        variant="h5"
        component="h6"
      >
        Text k opsání
      </Typography>
      <Badge
        className={classes.textField}
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
      <div className={classes.switchWrapper}>
        <TextNormalizeSwitches
          adjustText={adjustText}
          setAdjustText={setAdjustText}
          handleSwitchChange={handleSwitchChange}
          textInput={textInput} />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdjustText}
        >
          Uprav text
        </Button>
      </div>
    </div>
  );
}
