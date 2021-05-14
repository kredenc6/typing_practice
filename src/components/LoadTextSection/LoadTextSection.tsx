import React from "react";
import {
  makeStyles, Paper, Typography, ButtonGroup, Button, FormControlLabel, Checkbox,
  TextField
} from "@material-ui/core";
import LoadedParagraphSummary from "../LoadedParagraphSummary/LoadedParagraphSummary";
import { InsertTextOnLoad } from "../../pages/MainMenu/MainMenu";

const MIN_TEXT_INSERT_LENGTH = 100;
const MAX_TEXT_INSERT_LENGTH = 10000;

interface Props {
  handleLoadArcticle: (relativePath: string) => Promise<void>;
  handleInsertParagraph: (paragraph: string) => void;
  loadedParagraphs: string[];
  insertTextOnLoad: InsertTextOnLoad;
  handleInsertTextOnLoadChange: (changeObj: Partial<InsertTextOnLoad>) => void;
}

const useStyles = makeStyles({
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
  textFieldNumber: {
    width: "4rem"
  },
  loadedParagraphsOptions: {
    width: "35%",
    display: "grid",
    gridTemplateRows: "15% 85%"
  }
});

export default function LoadTextSection({
  handleLoadArcticle, loadedParagraphs, handleInsertParagraph,
  insertTextOnLoad, handleInsertTextOnLoadChange
}: Props) {
  const classes = useStyles();

  const handleInsertTextOnLoadLengthChange = (newLength: number) => {
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
    <Paper className={classes.loadTextSection} elevation={0}>
      <div className={classes.loadOptions}>
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
            <div>
              Při načtení článku rovnou vlož text o přibližné délce&nbsp;
              <TextField
                className={classes.textFieldNumber}
                value={insertTextOnLoad.length}
                size="small"
                inputProps={{ min: MIN_TEXT_INSERT_LENGTH, max: MAX_TEXT_INSERT_LENGTH }}
                type="number"
                onChange={e => handleInsertTextOnLoadLengthChange(Number(e.target.value))}
                onBlur={e => handleInsertTextOnLoadLengthChange(Number(e.target.value))}
                onWheel={handleNumberInputWheel} />
              &nbsp;znaků.
            </div>} />
      </div>
      <div className={classes.loadedParagraphsOptions}>
        <Typography component="h6" variant="h5">Nalezené odstavce</Typography>
        <LoadedParagraphSummary
          loadedParagraphs={loadedParagraphs}
          handleInsertParagraph={handleInsertParagraph} />
      </div>
    </Paper>
  );
}
