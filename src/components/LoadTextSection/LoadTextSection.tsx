import React from "react";
import {
  Paper, Typography, ButtonGroup, Button, FormControlLabel, Checkbox,
  TextField, Box
} from "@mui/material";
import LoadedParagraphSummary from "../LoadedParagraphSummary/LoadedParagraphSummary";
import { InsertTextOnLoad } from "../../pages/MainMenu/MainMenu";

const MIN_TEXT_INSERT_LENGTH = 100;
const MAX_TEXT_INSERT_LENGTH = 9999;

interface Props {
  handleLoadArcticle: (relativePath: string) => Promise<void>;
  handleInsertParagraph: (paragraph: string) => void;
  loadedParagraphs: string[];
  insertTextOnLoad: InsertTextOnLoad;
  handleInsertTextOnLoadChange: (changeObj: Partial<InsertTextOnLoad>) => void;
}

const styles = {
  loadTextSection: {
    height: "30%",
    display: "flex",
    justifyContent: "center",
    margin: "1rem",
    padding: "1rem"
  },
  loadOptions: {
    display: "flex",
    flexFlow: "column",
    justifyContent: "space-around",
    alignItems: "center"
  },
  loadedParagraphsOptions: {
    width: "35%",
    display: "grid",
    gridTemplateRows: "15% 85%"
  }
};

export default function LoadTextSection({
  handleLoadArcticle, loadedParagraphs, handleInsertParagraph,
  insertTextOnLoad, handleInsertTextOnLoadChange
}: Props) {
  const handleInsertTextOnLoadLengthChange = (newLength: number) => {
    handleInsertTextOnLoadChange({ length: newLength });
  };

  const handleInsertTextOnLoadLengthBlur = (newLength: number) => {
    newLength = Math.min(newLength, MAX_TEXT_INSERT_LENGTH);
    newLength = Math.max(newLength, MIN_TEXT_INSERT_LENGTH);
    handleInsertTextOnLoadChange({ length: newLength });
  };

  const toggleInsertTextOnLoadBooleanChange = () => {
    handleInsertTextOnLoadChange({ boolean: !insertTextOnLoad.boolean });
  };

  const handleNumberInputWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.persist();
    const changeBy = e.shiftKey ? 100 : 10;
    const prevLength = insertTextOnLoad.length;
    let newLength = e.deltaY < 0 ? prevLength - changeBy : prevLength + changeBy;
    newLength = Math.min(newLength, MAX_TEXT_INSERT_LENGTH);
    newLength = Math.max(newLength, MIN_TEXT_INSERT_LENGTH);
    handleInsertTextOnLoadChange({ length: newLength });
  };

  return (
    <Paper sx={styles.loadTextSection} elevation={0}>
      <Box sx={styles.loadOptions}>
        <ButtonGroup variant="outlined" color="primary" orientation="vertical">
          <Button
            onClick={() => handleLoadArcticle("/randomWiki")}
          >
            Načíst náhodný článek z Wikipedie
          </Button>
          <Button
            onClick={() => handleLoadArcticle("/wikiArticleOfTheWeek")}
          >
            Načíst článek týdne z Wikipedie
          </Button>
          <Button
            onClick={() => handleLoadArcticle("/oselLastArticle")}
          >
            Načíst poslední článek z Osla
          </Button>
        </ButtonGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={insertTextOnLoad.boolean}
              color="primary"
              onChange={toggleInsertTextOnLoadBooleanChange} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              Při načtení článku rovnou vlož text o přibližné délce&nbsp;
              <TextField
                variant="standard"
                margin="dense"
                sx={{ 
                      marginLeft: "0.1rem",
                      marginRight: "0.1rem",
                      width: "3.5rem",
                      "& input": { textAlign: "center" },
                      // getting rid of the arrows in the input 
                      "& input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none", margin: 0
                      },
                      "& input[type=number]": {
                        "-moz-appearance": "textfield"
                      }
                }}
                value={insertTextOnLoad.length}
                size="small"
                inputProps={{ min: MIN_TEXT_INSERT_LENGTH, max: MAX_TEXT_INSERT_LENGTH }}
                type="number"
                onChange={e => handleInsertTextOnLoadLengthChange(Number(e.target.value))}
                onBlur={e => handleInsertTextOnLoadLengthBlur(Number(e.target.value))}
                onWheel={handleNumberInputWheel} />
              &nbsp;znaků.
            </Box>} />
      </Box>
      <Box sx={styles.loadedParagraphsOptions}>
        <Typography component="h6" variant="h5">Nalezené odstavce</Typography>
        <LoadedParagraphSummary
          loadedParagraphs={loadedParagraphs}
          handleInsertParagraph={handleInsertParagraph} />
      </Box>
    </Paper>
  );
}
