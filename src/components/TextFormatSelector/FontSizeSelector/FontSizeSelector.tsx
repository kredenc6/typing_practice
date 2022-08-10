import { ButtonGroup, Grid } from "@mui/material";
import SelectableFontSize from "../SelectableFontSize/SelectableFontSize";
import { fontSizes } from "../../../styles/textDisplayTheme/textDisplayData";
import { FontSize, FontStyle } from "../../../types/themeTypes";
import SettingsButton from "../../PlaySettings/SettingsButton/SettingsButton";

interface Props {
  activeFontSize: FontSize;
  handleFontSizeChange: (fontSize: FontStyle["fontSize"]) => void;
}

export type TypeDescription = "malé" | "střední" | "velké";
interface SelectableFontSizeButtonProps {
  [propName: string]: {
    variant: "h5" | "h4" | "h3";
    typeDescription: TypeDescription;
  }
}

const SELECTABLE_FONT_SIZE_BUTTON_VARIABLES: SelectableFontSizeButtonProps = {
  "20px": {
    variant: "h5",
    typeDescription: "malé"
  },
  "30px": {
    variant: "h4",
    typeDescription: "střední"
  },
  "40px": {
    variant: "h3",
    typeDescription: "velké"
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
      <Grid container justifyContent="space-between" spacing={3} wrap="nowrap">
        {GridButtonComponents}
      </Grid>
    </ButtonGroup>
  );
}
