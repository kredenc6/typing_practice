import React from "react";
import { makeStyles, Paper } from "@material-ui/core";
import Simplebar from "simplebar-react";
import LoadedParagraph from "../LoadedParagraph/LoadedParagraph";

interface Props {
  loadedParagraphs: string[];
  handleInsertParagraph: (paragraph: string) => void;
}

const useStyles = makeStyles({
  paragraphSummary: {
    width: "35%",
    height: "100%"
  },
  paragraphWrapper: {
    paddingRight: "12px"
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
      <Simplebar style={{ maxHeight: "100%" }} autoHide={false}>
        <div className={classes.paragraphWrapper}>
          {LoadedParagraphComponents}
        </div>
      </Simplebar>
    </Paper>
  );
}
