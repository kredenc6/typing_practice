import React from "react";
import { ButtonGroup, Grid } from "@material-ui/core";
import SelectableFontSize from "../SelectableFontSize/SelectableFontSize";
import { fontSizes } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontSize, FontStyle } from "../../../types/themeTypes";
import SettingsButton from "../../PlaySettings/SettingsButton/SettingsButton";

interface Props {
  activeFontSize: FontSize;
  handleFontSizeChange: (fontSize: FontStyle["fontSize"]) => void;
}

interface SelectableFontSizeButtonProps {
  [propName: string]: {
    variant: "h5" | "h4" | "h3";
    typeDescription: "small" | "medium" | "large";
  }
}

const SELECTABLE_FONT_SIZE_BUTTON_VARIABLES: SelectableFontSizeButtonProps = {
  "20px": {
    variant: "h5",
    typeDescription: "small"
  },
  "30px": {
    variant: "h4",
    typeDescription: "medium"
  },
  "40px": {
    variant: "h3",
    typeDescription: "large"
  }
};

export default function FontSizeSelector({ activeFontSize, handleFontSizeChange }: Props) {
  const GridButtonComponents = fontSizes.map(fontSize => {
    return (
      <Grid item key={fontSize}>
        <SettingsButton
          disabled={activeFontSize === fontSize}
          onClick={() => handleFontSizeChange(fontSize)}
        >
          <SelectableFontSize
            typographyVariant={SELECTABLE_FONT_SIZE_BUTTON_VARIABLES[fontSize].variant}
            typeDescription={SELECTABLE_FONT_SIZE_BUTTON_VARIABLES[fontSize].typeDescription} />
        </SettingsButton>
      </Grid>
    );
  });

  return (
    <ButtonGroup size="small" variant="text">
      <Grid container justify="space-between" spacing={3} wrap="nowrap">
        {GridButtonComponents}
      </Grid>
    </ButtonGroup>
  );
}
