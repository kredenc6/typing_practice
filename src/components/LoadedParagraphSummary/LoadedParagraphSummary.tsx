import { Box, Paper } from "@mui/material";
import Simplebar from "simplebar-react";
import LoadedParagraph from "../LoadedParagraph/LoadedParagraph";

interface Props {
  loadedParagraphs: string[];
  handleInsertParagraph: (paragraph: string) => void;
}

const styles = {
  paragraphSummary: {
    width: "100%",
    overflow: "hidden"
  },
  paragraphWrapper: {
    paddingRight: "12px"
  }
};

export default function LoadedParagraphSummary({
  loadedParagraphs, handleInsertParagraph
}: Props) {
  const LoadedParagraphComponents = loadedParagraphs.map((loadedParagraph, i) =>
    <LoadedParagraph
      key={i}
      loadedParagraph={loadedParagraph}
      paragraphId={i + 1}
      handleInsertParagraph={handleInsertParagraph} />
  );

  return (
    <Paper sx={styles.paragraphSummary} variant="outlined">
      <Simplebar style={{ maxHeight: "100%" }} autoHide={false}>
        <Box sx={styles.paragraphWrapper}>
          {LoadedParagraphComponents}
        </Box>
      </Simplebar>
    </Paper>
  );
}
