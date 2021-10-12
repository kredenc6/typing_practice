import React from "react";
import { Box, makeStyles, Paper } from "@material-ui/core";
import Simplebar from "simplebar-react";
import LoadedParagraph from "../LoadedParagraph/LoadedParagraph";

interface Props {
  loadedParagraphs: string[];
  handleInsertParagraph: (paragraph: string) => void;
}

const useStyles = makeStyles({
  paragraphSummary: {
    width: "100%",
    overflow: "hidden"
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
    <Paper className={classes.paragraphSummary} variant="outlined">
      <Simplebar style={{ maxHeight: "100%" }} autoHide={false}>
        <Box className={classes.paragraphWrapper}>
          {LoadedParagraphComponents}
        </Box>
      </Simplebar>
    </Paper>
  );
}
