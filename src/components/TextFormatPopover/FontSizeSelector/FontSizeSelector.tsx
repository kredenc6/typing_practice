import React from "react";
import { ButtonGroup, Grid } from "@material-ui/core";
import SelectableFontSizeButton from "../SelectableFontSizeButton/SelectableFontSizeButton";
import { fontSizes } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontSize, FontStyle } from "../../../types/types";

interface Props {
  handleFontSizeChange: (fontSize: FontStyle["fontSize"]) => void;
  activeFontSize: FontSize;
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

export default function FontSizeSelector({ handleFontSizeChange, activeFontSize }: Props) {
  const GridButtonComponents = fontSizes.map(fontSize => {
    return (
      <Grid item key={fontSize}>
        <SelectableFontSizeButton
          disabled={activeFontSize === fontSize}
          onClick={() => handleFontSizeChange(fontSize)}
          typographyVariant={SELECTABLE_FONT_SIZE_BUTTON_VARIABLES[fontSize].variant}
          typeDescription={SELECTABLE_FONT_SIZE_BUTTON_VARIABLES[fontSize].typeDescription} />
      </Grid>
    );
  })

  return (
    <ButtonGroup size="small" variant="text">
        <Grid container justify="space-between" spacing={3} wrap="nowrap">
        {GridButtonComponents}
        </Grid>
      </ButtonGroup>
  );
}
