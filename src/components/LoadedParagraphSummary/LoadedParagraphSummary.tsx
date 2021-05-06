import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import LoadedParagraph from "../LoadedParagraph/LoadedParagraph";

interface Props {
  loadedParagraphs: string[];
  handleInsertParagraph: (paragraph: string) => void;
}

const useStyles = makeStyles({
  paragraphSummary: {
    width: "35%",
    height: "100%",
    overflowY: "auto"
  }
});

export default function LoadedParagraphSummary({
  loadedParagraphs, handleInsertParagraph
}: Props) {
  const classes = useStyles();

  const LoadedParagraphComponents = loadedParagraphs.map((loadedParagraph, i) =>
    <LoadedParagraph
      key={i}
      loadedParagraph={loadedParagraph}
      paragraphId={i + 1}
      handleInsertParagraph={handleInsertParagraph} />
  );

  return (
    <Paper className={classes.paragraphSummary}>
      {LoadedParagraphComponents}
    </Paper>
  );
}
